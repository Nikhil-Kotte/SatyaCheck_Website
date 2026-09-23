"""
Sound design for story clip 3 ("The pressure"), over the existing picture
(hands hesitating over a payment screen, last 10 s of videos/3.mp4).

Bed (always): a loud wall clock, a 50 Hz fridge hum, a low dissonant drone
that swells, a heartbeat that speeds up, and two bangle clinks.

Voice (optional): pass a recording of the caller's lines and it is placed on
top with a phone-speaker treatment (band-limited, saturated, compressed).
Suggested lines, read panicked and fast, about 7 s in total:
    "Maa, please, listen to me, I'm in big trouble."
    "Don't tell Papa. Send it now, I'll explain later!"

Usage:
    python scratch/story3_audio.py out.wav                 # bed only
    python scratch/story3_audio.py out.wav voice.wav [0.8] # bed + voice starting at 0.8 s
"""

import subprocess
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 10.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(3)


def lowpass(x, hz, order=4):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def highpass(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def ramp(a, b):
    """0 before a, rising to 1 at b (seconds)."""
    return np.clip((t - a) / (b - a), 0, 1)


def place(track, sig, at, gain=1.0):
    i = int(at * SR)
    n = min(len(sig), N - i)
    if n > 0:
        track[i : i + n] += sig[:n] * gain


# ---------- wall clock: tick / tock, slightly different pitch ----------
def tick(freq):
    n = int(0.05 * SR)
    tt = np.arange(n) / SR
    click = rng.standard_normal(n) * np.exp(-tt * 380)
    body = np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 120)
    return highpass(click * 0.6 + body * 0.5, 800)


clock = np.zeros(N)
for k, at in enumerate(np.arange(0.35, DUR, 1.0)):
    place(clock, tick(2400 if k % 2 == 0 else 2050), at)
clock *= 0.55 + 0.45 * ramp(0, 9)  # the ticking gets louder as she hesitates

# ---------- fridge hum (Indian mains: 50 Hz) ----------
hum = sum(g * np.sin(2 * np.pi * f * t) for f, g in ((50, 0.5), (100, 0.35), (150, 0.12), (250, 0.05)))
hum = lowpass(hum, 400) * 0.03

# ---------- tension drone: two close low tones beating against each other ----------
drone = np.sin(2 * np.pi * 55 * t) + 0.8 * np.sin(2 * np.pi * 58.3 * t) + 0.25 * np.sin(2 * np.pi * 110.7 * t)
noise = lowpass(rng.standard_normal(N), 300)
noise /= np.abs(noise).max()
drone = lowpass(drone + 0.4 * noise, 250)
drone *= (0.25 + 0.75 * ramp(0.5, 9.2) ** 1.5) * 0.09

# ---------- heartbeat, 72 -> 104 bpm ----------
def thump(amp):
    n = int(0.16 * SR)
    tt = np.arange(n) / SR
    return amp * np.sin(2 * np.pi * 52 * tt * (1 - 0.3 * tt / 0.16)) * np.exp(-tt * 28)


heart = np.zeros(N)
pos = 1.2
while pos < DUR - 0.3:
    bpm = 72 + 32 * (pos / DUR) ** 1.4
    place(heart, thump(1.0), pos)
    place(heart, thump(0.6), pos + 0.19)  # lub-dub
    pos += 60 / bpm
heart = lowpass(heart, 160) * (0.3 + 0.7 * ramp(1.2, 8.5)) * 0.35

# ---------- bangle clinks: inharmonic metallic partials ----------
def clink():
    n = int(0.9 * SR)
    tt = np.arange(n) / SR
    partials = ((2870, 1.0, 9), (4210, 0.6, 12), (5980, 0.35, 15), (7630, 0.2, 20))
    return sum(g * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, g, d in partials)


clinks = np.zeros(N)
place(clinks, clink(), 2.3, 0.05)
place(clinks, clink(), 2.36, 0.03)
place(clinks, clink(), 6.9, 0.045)

# ---------- optional caller voice through a phone speaker ----------
voice = np.zeros(N)
if len(sys.argv) > 2:
    # Decode through ffmpeg: accepts any format, and tolerates the malformed
    # WAV headers some TTS tools write (scipy rejects those).
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", sys.argv[2], "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True,
        check=True,
    ).stdout
    v = np.frombuffer(raw, dtype=np.int16).astype(np.float64)
    v /= np.abs(v).max() + 1e-9
    v = bandpass(v, 320, 3400)  # telephone band
    v = np.tanh(v * 3.0) / np.tanh(3.0)  # small-speaker saturation
    # Simple compressor so every word cuts through.
    env = np.sqrt(lowpass(v**2, 12, order=2).clip(1e-9))
    v = v / np.maximum(env, 0.12) * 0.12
    v /= np.abs(v).max() + 1e-9
    start = float(sys.argv[3]) if len(sys.argv) > 3 else 0.8
    place(voice, v, start, 0.9)

# ---------- mix ----------
room_ir_t = np.arange(int(0.6 * SR)) / SR
room_ir = lowpass(rng.standard_normal(len(room_ir_t)) * np.exp(-room_ir_t * 9), 5000)
room_ir /= np.sqrt((room_ir**2).sum())

bed = clock * 0.5 + hum + drone + heart + clinks
bed = bed + 0.25 * fftconvolve(bed, room_ir)[:N]  # small kitchen

L = bed + voice * 0.95 + np.roll(clinks, 60) * 0.3
R = bed + voice * 0.95 + np.roll(clock, 90) * 0.15  # clock slightly off-centre

master = np.stack([L, R], axis=1)
fade = np.minimum(1, np.minimum(t / 0.05, (DUR - t) / 0.4))[:, None]
master *= fade
master /= np.abs(master).max() / 0.7

out = sys.argv[1] if len(sys.argv) > 1 else "story3_audio.wav"
wavfile.write(out, SR, (master * 32767).astype(np.int16))
print("wrote", out, "with voice" if len(sys.argv) > 2 else "(bed only)")
