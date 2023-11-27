# TLG Video Control
Control background video playback with native Webflow interactions. Say goodbye to heavy image sequences embedded into Lottie files.

## 🔗 Snippet

Copy the `<script>` below and paste it before the `</body>` tag in your Webflow project on the pages where you need it.

```html
<!-- Snippets by The Lazy God • Video Control -->
<script defer src="https://cdn.jsdelivr.net/gh/the-lazy-god/tlg-video-control@v1.0.0/tlg-video-control.min.js"></script>
``` 

## 🔧 Setup

### ✅ Required Setup

#### 1: Add the attribute to background video elements

Add the attribute below to any background video element you want to control. Use the number as an identifier when using multiple videos on the same page.

**Attribute:**

-   Name: `tlg-control-element`
-   Value: `video-1` (and video-2, video-3, and so on...)

#### 2: Create a variable for each video

Create a variable of type size for each video to control the progress of the video.

**Variable (type = size):**

-   Name: `tlg/video-control-1` (Repeat for each video-2, video-3, and so on...)
-   Value: `0px` (Initialize this value to 0px)

#### 3: Create native Webflow interactions

Create any Webflow interaction where you animate the variables created above. The value of the variable going from 0 to 100 will correspond to video progress going from 0 to 100% completion.

### ⚡️ Optional Add-ons

#### Set maximum frames per second for each video

Add this to the background video elements to set the maximum fps for the playback of that video. This doesn’t affect playback speed. Default is 30 FPS.

**Attribute (Optional):**

-   Name: `tlg-video-control-fps`
-   Value: `{number}` (Default = 30)

## 📦 Attributes and variables

### Attributes

| Attribute                      | Description                                                                     | Values          | Default |
|:-------------------------------|:---------------------------------------------------------------------------------|:-----------------|:--------|
| tlg-video-control              | Attribute to identify background video elements for control. Set to `video-1`, `video-2`, `video-3` and so on.                    | `video{index}`           |         |
| tlg-video-control-fps          | Optional attribute to set the maximum frames per second for video playback. Recommended to leave at 30 fps for best performance across browsers.      | Number          | 30      |

####  Variables

| Variable          | Description                                   | Type   | 
|:------------------|:----------------------------------------------|:-------|
| `tlg/video-control-{index}`   | CSS variable used for video control. Type must be size, but only the numerical value is used (the unit doesn't matter). In Webflow it needs to be defined like this `tlg/video-control-1`, `tlg/video-control-2`, `tlg/video-control-3` and so on, which will create a folder called 'tlg'.           | Size | `--tlg/video-control-1`   |

## ☝️ Recommendations

- This is more lightweight than image sequences embedded in a lottie, but it is still recommended to keep video size down. Below 10 MB should be fine.
- This script works with multiple videos on the same page, triggered by the same or multiple interactions. But performance may be impacted if there are a lot of videos on the same page. Up to 5 videos on one page should be fine.

## 🫠 Known Issues

- Playback can be choppy in Chrome when setting fps higher than 30.
- Playback is very choppy in Firefox.
- Limited testing has been done on Android devices.
