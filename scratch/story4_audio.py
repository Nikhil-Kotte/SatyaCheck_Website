"""
Music for story clip 4 ("The check"): the phone on the table, then rings of
light pulsing out of it (videos/4.mp4, 10 s).

  0.0-3.7  Bm(add9) pad, filter closed, sparse "listening" plucks (still uneasy)
  2.8-3.7  soft swell and reversed bell into the first ring burst
  3.7      resolves to Dmaj9: the filter opens, a bell and a sub bloom
  6.0      Gmaj7(9)
  8.0      Dadd9, fading out by 10 s
  Bells land on the ring pulses at 4.0, 5.6 and 7.6 s.

Usage: python scratch/story4_audio.py out.wav
"""

import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 10.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(4)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "low", fs=SR, output="sos"), x)


def highpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, "high", fs=SR, output="sos"), x)


def window(a, b, fade=0.35):
    """1 between a and b seconds, with raised-cosine fades at both ends."""
    up = np.clip((t - a) / fade + 0.5, 0, 1)
    down = np.clip((b - t) / fade + 0.5, 0, 1)
    return (0.5 - 0.5 * np.cos(np.pi * up)) * (0.5 - 0.5 * np.cos(np.pi * down))


def place(track, sig, at, gain=1.0):
    i = int(at * SR)
    n = min(len(sig), N - i)
    if n > 0:
        track[i : i + n] += sig[:n] * gain


CHORDS = [  # (start, end, voicing as MIDI notes, bass MIDI)
    (-1.0, 3.7, [47, 54, 59, 61, 62], 35),  # Bm(add9)
    (3.7, 6.0, [50, 57, 61, 64, 66], 38),  # Dmaj9
    (6.0, 8.0, [43, 55, 59, 62, 66, 69], 31),  # Gmaj7(9)
    (8.0, 11.0, [50, 57, 64, 66, 69], 38),  # Dadd9
]

# ---------- pad: detuned saw voices, crossfaded between a closed and open filter ----------
def saw(f):
    out = np.zeros(N)
    for h in range(1, int(4000 / f) + 1):
        out += np.sin(2 * np.pi * f * h * t + h) / h
    return out


pad = np.zeros(N)
bass = np.zeros(N)
for start, end, notes, root in CHORDS:
    w = window(start, end)
    chord = np.zeros(N)
    for m in notes:
        for det in (-0.07, 0.0, 0.06):  # cents-ish detune in semitones
            chord += saw(hz(m + det)) / len(notes)
    pad += chord * w
    bass += np.sin(2 * np.pi * hz(root) * t) * w

opening = np.clip((t - 3.2) / 1.2, 0, 1) ** 1.5  # filter opens into the resolution
pad = lowpass(pad, 450, 4) * (1 - opening) + lowpass(pad, 2600, 2) * opening
pad = highpass(pad, 90) * (0.55 + 0.45 * opening) * 0.16
bass = lowpass(bass, 120) * (0.35 + 0.65 * opening) * 0.13

# ---------- plucked arpeggio ----------
def pluck(f, dur=0.9):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 9)
    return tone * np.exp(-tt * 5.5) * np.minimum(1, tt / 0.004)


def chord_at(time):
    for start, end, notes, _ in CHORDS:
        if start <= time < end:
            return notes
    return CHORDS[-1][2]


arp = np.zeros(N)
pattern = [0, 2, 3, 4, 3, 2]
k = 0
time = 0.6
while time < 9.3:
    notes = sorted(chord_at(time))
    m = notes[pattern[k % len(pattern)] % len(notes)] + 12
    before = time < 3.7
    place(arp, pluck(hz(m)), time, 0.08 if before else 0.13)
    time += 0.625 if before else 0.3125
    k += 1
arp = highpass(arp, 250)

# ---------- bells on the ring pulses, plus a reversed bell into the first ----------
def bell(f, dur=2.4):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    partials = ((1.0, 1.0, 1.6), (2.76, 0.45, 3.0), (5.40, 0.22, 5.0), (8.93, 0.1, 8.0))
    return sum(g * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * d) for r, g, d in partials)


bells = np.zeros(N)
place(bells, bell(hz(74)), 3.7, 0.22)  # D5 on the resolution
place(bells, bell(hz(81)), 4.0, 0.12)  # A5, first ring burst
place(bells, bell(hz(78)), 5.6, 0.12)  # F#5
place(bells, bell(hz(79)), 7.6, 0.12)  # G5
rev = bell(hz(74), 0.9)[::-1] * np.linspace(0, 1, int(0.9 * SR)) ** 2  # fade in: the cut tail would click
place(bells, rev, 3.7 - len(rev) / SR, 0.12)

# ---------- swell and sub bloom ----------
noise = rng.standard_normal(N)
swell = lowpass(noise, 1800) * np.clip((t - 2.8) / 0.9, 0, 1) ** 2 * (t < 3.75) * 0.05
bloom = np.sin(2 * np.pi * hz(38) * t) * np.exp(-np.clip(t - 3.7, 0, None) * 2.2) * (t >= 3.7) * 0.18

# ---------- stereo mix with a long, soft reverb ----------
dry_c = pad + bass + bloom + swell
L = dry_c + arp * 0.9 + bells
R = dry_c + np.roll(arp, int(0.011 * SR)) * 0.9 + np.roll(bells, int(0.007 * SR))

ir_t = np.arange(int(2.6 * SR)) / SR
for ch_seed, ch in ((1, "L"), (2, "R")):
    ir = np.random.default_rng(ch_seed).standard_normal(len(ir_t)) * np.exp(-ir_t * 2.4)
    ir = lowpass(ir, 5000)
    ir /= np.sqrt((ir**2).sum())
    if ch == "L":
        L = L + 0.35 * fftconvolve(L, ir)[:N]
    else:
        R = R + 0.35 * fftconvolve(R, ir)[:N]

master = np.stack([L, R], axis=1)
fade = np.minimum(1, np.minimum(t / 0.3, (DUR - t) / 1.2)).clip(0)[:, None]
master *= fade
master /= np.abs(master).max() / 0.7

out = sys.argv[1] if len(sys.argv) > 1 else "story4_audio.wav"
wavfile.write(out, SR, (master * 32767).astype(np.int16))
print("wrote", out)
