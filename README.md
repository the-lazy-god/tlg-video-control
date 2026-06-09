# TLG Video Control
Control background video playback with native Webflow interactions. Say goodbye to heavy image sequences embedded into Lottie files.

## 🔗 Snippet

Copy the `<script>` below and paste it before the `</body>` tag in your Webflow project on the pages where you need it.

```html
<!-- Snippets by The Lazy God • Video Control -->
<script defer src="https://cdn.jsdelivr.net/gh/the-lazy-god/tlg-video-control@v2.0.0/tlg-video-control.min.js"></script>
``` 

## 🔧 Setup

### ✅ Required Setup

#### 1: Create a variable for each video

Create a variable for each video to control the progress of the video. **Number** is the recommended type, but **size** also works — the script only reads the numeric value, so the unit (if any) is ignored.

**Variable (type = number, or size):**

-   Name: `video-control-1` (use a unique name per video)
-   Value: `0` (Initialize this value to 0)

> In Webflow, naming a variable `video-control-1` outputs the CSS custom property `--video-control-1`. You can use folders (e.g. `tlg/video-control-1` → `--tlg/video-control-1`) — just note the resulting variable name, since you'll reference it in the next step.

#### 2: Add the attribute to your video elements

Add the attribute below to each video you want to control. The value is the **name of the CSS variable** you just created — it links the element to its variable.

You can put the attribute either directly on the `<video>` element, or on a parent/wrapper element that contains a `<video>` (the script will find the video inside it).

**Attribute:**

-   Name: `tlg-video-control`
-   Value: the control variable name, e.g. `--video-control-1` (match each video to its variable)

The value also accepts a `var()` wrapper, so `--video-control-1`, `var(--video-control-1)`, and `var(--video-control-1, 0%)` all work — handy when copying a variable reference straight out of Webflow.

#### 3: Create native Webflow interactions

Create any Webflow interaction where you animate the variables created above. The value of the variable going from 0 to 100 will correspond to video progress going from 0 to 100% completion.

## 📦 Attributes and variables

### Attributes

| Attribute            | Description                                                                                                                                                                             | Values                                                        | Default |
|:---------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------|:--------|
| `tlg-video-control`  | Links a video to its control variable. Set the value to the CSS variable name that drives that video's progress. Can be placed on the `<video>` itself or on a wrapper containing one. | A CSS custom property name, e.g. `--video-control-1` or `var(--video-control-1)` |         |

### Variables

| Variable                | Description                                                                                                                                                              | Type            |
|:------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------|
| _(your chosen name)_    | The CSS variable used for video control, named by you and referenced in the matching `tlg-video-control` attribute. The script reads only the numeric value, so any unit is ignored. Animate it from 0 to 100 for 0–100% progress. | Number (or Size) |

## ⚙️ How it works

- The script watches the control variables on `:root` (where Webflow sets them) with a single observer and updates every controlled video in one batched pass per animation frame.
- Updates are capped at a fixed **30 FPS** — the sweet spot for smooth, cross-browser playback. This is no longer configurable per video.
- Looping is disabled on controlled videos automatically. Since these videos are scrubbed (not played), looping only caused an occasional flash to the first frame near 100%.

## 🎞️ Optimize seeking with a lower GOP

Scrubbing works by setting the video's `currentTime`, which makes the browser **seek**. To seek, the browser jumps to the nearest keyframe (I-frame) and then decodes every frame forward until it reaches the target. The spacing between keyframes is the video's **GOP** (Group of Pictures, i.e. the keyframe interval).

Most videos are encoded with a large GOP (few keyframes) to save file size — great for normal playback, but it makes scrubbing slow and janky, because each tiny step can force the browser to decode many frames to land on the right one.

**Lowering the GOP adds more keyframes, so every seek lands close to one — making scrubbing much smoother.** A GOP of **1** (every frame is a keyframe) gives the best possible scrubbing performance, at the cost of a larger file. A GOP of **5** or **10** brings the file size back down while still giving fine results, so tune to taste.

**Firefox** seems to struggle the most with scrubbing, but it gets good with a low GOP — so if you're seeing jank there, that's the first thing to try.

You can re-encode a video with a lower GOP locally with FFMPEG, or use my in-browser microtool: [Keyframes](https://keyframes.thelazygod.com).

## ☝️ Recommendations

- This is more lightweight than image sequences embedded in a lottie, but it is still recommended to keep video size down. Below 10 MB should be fine.
- For the smoothest scrubbing, re-encode your video with a low GOP (1 for best results, or 5–10 to save file size). See [Optimize seeking with a lower GOP](#-optimize-seeking-with-a-lower-gop).
- This script works with multiple videos on the same page, triggered by the same or multiple interactions. But performance may be impacted if there are a lot of videos on the same page. Up to 5 videos on one page should be fine.

## 🫠 Known Issues

- Firefox struggles the most with scrubbing and can be choppy by default, but performs well once the video is encoded with a low GOP (see [Optimize seeking with a lower GOP](#-optimize-seeking-with-a-lower-gop)).
- A high GOP (few keyframes) causes choppy scrubbing in any browser — lowering it is the main fix.
- Limited testing has been done on Android devices.
