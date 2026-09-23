"""
Sound design for story clip 1 ("The clone"), synthesised from scratch.

Timeline (matches videos/1.mp4, 10 s):
  0.0-1.2  room tone under the dissolve from the living room
  0.6-10   warm drone bed
  1.0-4.1  a murmuring, speech-like voice (the son's voice, unintelligible)
  3.6-5.0  digital scan riser + glitch ticks as the waveform splits in two
  5.0-9.6  the original voice (left) and a bit-crushed clone (right) that
           starts out of step and drifts into sync

Usage:  python scratch/story1_audio.py out.wav
Then mux with ffmpeg (see README, "Story videos").
"""

import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, iirpeak, lfilter, sosfilt

SR = 48000
DUR = 10.005
N = int(SR * DUR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR


def env(start, end, fade_in=0.4, fade_out=0.6):
    """Smooth on/off envelope over the whole timeline."""
    e = np.zeros(N)
    a, b = int(start * SR), min(N, int(end * SR))
    seg = np.ones(b - a)
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    if fi:
        seg[:fi] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    if fo:
        seg[-fo:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    e[a:b] = seg
    return e


def lowpass(x, hz, order=4):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def highpass(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


# ---------- room tone ----------
brown = np.cumsum(rng.standard_normal(N))
brown = highpass(brown - brown.mean(), 40)
brown /= np.abs(brown).max()
room = lowpass(brown, 900) * env(0, 1.6, 0.05, 1.0) * 0.12

# ---------- drone bed (A minor-ish, slowly breathing) ----------
drone = np.zeros(N)
for f, g in [(55, 0.5), (110, 0.35), (164.81, 0.22), (220, 0.12), (329.63, 0.05)]:
    detune = 1 + 0.0015 * np.sin(2 * np.pi * 0.07 * t + f)
    drone += g * np.sin(2 * np.pi * f * detune * t)
drone *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.18 * t)  # slow breathing
drone = lowpass(drone, 700)
drone_env = env(0.6, DUR, 1.6, 1.4) * (1 + 0.6 * env(4.0, 6.5, 0.9, 1.5))  # swell at the split
drone *= drone_env * 0.16

# ---------- speech-like voice ----------
VOWELS = {  # formants F1, F2, F3 (Hz)
    "a": (730, 1090, 2440),
    "e": (530, 1840, 2480),
    "i": (300, 2200, 2950),
    "o": (570, 840, 2410),
    "u": (320, 870, 2240),
}


def syllable(dur, f0a, f0b, vowel):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f0 = np.linspace(f0a, f0b, n) * (1 + 0.004 * rng.standard_normal(n).cumsum() / np.sqrt(n))
    phase = 2 * np.pi * np.cumsum(f0) / SR
    src = np.zeros(n)
    for h in range(1, 28):  # band-limited glottal source, ~1/h^1.3 roll-off
        mask = (f0 * h) < 5000
        src += mask * np.sin(h * phase) / h**1.3
    src += 0.08 * rng.standard_normal(n)  # breath
    out = np.zeros(n)
    for fc, gain, q in zip(VOWELS[vowel], (1.0, 0.55, 0.25), (6, 9, 12)):
        b, a = iirpeak(fc, q, fs=SR)
        out += gain * lfilter(b, a, src)
    a_len, r_len = int(0.03 * SR), int(0.07 * SR)
    shape = np.ones(n)
    shape[:a_len] = np.linspace(0, 1, a_len) ** 1.5
    shape[-r_len:] *= np.linspace(1, 0, r_len) ** 1.5
    return out * shape * (0.8 + 0.2 * np.sin(np.pi * tt / dur))


def phrase_track(start, end, seed, base_f0=150):
    """Overlap-add syllables in phrases between start and end (seconds)."""
    r = np.random.default_rng(seed)
    track = np.zeros(N)
    pos = start
    while pos < end - 0.2:
        n_syl = r.integers(3, 7)
        contour = base_f0 * (1.12 - 0.18 * np.linspace(0, 1, n_syl))  # phrase declination
        for k in range(n_syl):
            dur = r.uniform(0.11, 0.24)
            if pos + dur > end:
                break
            f0 = contour[k] * r.uniform(0.95, 1.07)
            s = syllable(dur, f0, f0 * r.uniform(0.94, 1.05), r.choice(list(VOWELS)))
            i = int(pos * SR)
            track[i : i + len(s)] += s[: max(0, min(len(s), N - i))]
            pos += dur + r.uniform(0.01, 0.05)
        pos += r.uniform(0.22, 0.4)  # pause between phrases
    track = lowpass(highpass(track, 90), 3800)
    return track / (np.abs(track).max() + 1e-9)


voice_a = phrase_track(1.0, 9.6, seed=11)
voice_a *= env(1.0, 9.6, 0.3, 0.9) * (1 - 0.35 * env(5.0, 10.1, 0.8, 0.1))  # quieter once the clone joins

# The clone: same words, starts ~90 ms late and drifts into sync, then gets a
# digital sheen (sample-and-hold decimation + 6-bit quantisation).
delay = np.clip(0.09 * (1 - (t - 5.0) / 3.5), 0, 0.09)
idx = np.clip((np.arange(N) - delay * SR).astype(int), 0, N - 1)
clone = voice_a[idx] / (np.abs(voice_a).max() + 1e-9)
held = np.repeat(clone[::5], 5)[:N]
crushed = np.round(held * 32) / 32
clone = 0.55 * clone + 0.45 * crushed
clone = lowpass(clone, 5200)
clone *= env(5.0, 9.6, 0.6, 0.9) * 0.9

# ---------- the split: riser, ticks, sub hit ----------
riser_noise = rng.standard_normal(N)
riser = np.zeros(N)
a, b = int(3.6 * SR), int(5.0 * SR)
seg = riser_noise[a:b]
chunks = np.array_split(np.arange(b - a), 28)
for j, ch in enumerate(chunks):  # sweeping band-pass 400 Hz -> 5 kHz
    fc = 400 * (5000 / 400) ** (j / (len(chunks) - 1))
    riser[a + ch] = bandpass(seg, fc * 0.8, min(fc * 1.25, 20000))[ch]
riser *= env(3.6, 5.05, 1.2, 0.08) * 0.35

ticks = np.zeros(N)
for tk in (4.35, 4.52, 4.61, 4.78, 4.86, 4.95):
    i = int(tk * SR)
    L = int(0.012 * SR)
    ticks[i : i + L] += rng.standard_normal(L) * np.exp(-np.linspace(0, 8, L))
ticks = highpass(ticks, 2500) * 0.5

sub = np.sin(2 * np.pi * 48 * t * (1 - 0.35 * np.clip(t - 5.0, 0, 1))) * np.exp(-np.clip(t - 5.0, 0, None) * 3.5)
sub *= (t >= 5.0) * 0.45

# Soft shimmer while the two lines ride together.
shimmer = sum(np.sin(2 * np.pi * f * t) * (0.5 + 0.5 * np.sin(2 * np.pi * r * t)) for f, r in ((1760, 0.9), (2637, 1.3), (3520, 0.6)))
shimmer *= env(5.2, 9.8, 1.5, 1.2) * 0.012

# ---------- mix to stereo ----------
def pan(x, p):  # p: -1 left .. 1 right, equal power
    ang = (p + 1) * np.pi / 4
    return np.cos(ang) * x, np.sin(ang) * x


L = np.zeros(N)
R = np.zeros(N)
for sig, p in [
    (room, 0.0),
    (drone, 0.0),
    (voice_a * 0.5, -0.15 - 0.45 * env(5.0, 10.1, 0.8, 0.1)),  # moves left as the clone appears
    (clone * 0.42, 0.6),
    (riser, 0.0),
    (sub, 0.0),
    (shimmer, 0.0),
]:
    l, r = pan(sig, p)
    L += l
    R += r
L += ticks * 0.8
R += np.roll(ticks, int(0.004 * SR))  # ticks slightly wide

# Short synthetic room reverb.
ir_t = np.arange(int(1.3 * SR)) / SR
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 4.2)
ir = lowpass(ir, 6000)
ir /= np.sqrt((ir**2).sum())
L = L + 0.22 * fftconvolve(L, ir)[:N]
R = R + 0.22 * fftconvolve(R, np.roll(ir, 157))[:N]

master = np.stack([L, R], axis=1)
master *= env(0, DUR, 0.02, 0.35)[:, None]
master /= np.abs(master).max() / 0.7  # leave headroom; ffmpeg loudnorm sets final level

out = sys.argv[1] if len(sys.argv) > 1 else "story1_audio.wav"
wavfile.write(out, SR, (master * 32767).astype(np.int16))
print("wrote", out, f"{DUR:.3f}s")
