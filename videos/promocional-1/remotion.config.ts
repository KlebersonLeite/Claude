/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// ---- Higher output quality ----
// Render the 720x1280 design at 1.5x => 1080x1920 (sharp, layout preserved)
Config.setScale(1.5);
// Max-quality JPEG frames feeding the encoder
Config.setJpegQuality(100);
// High-quality H.264 (lower CRF = better quality; 16 is visually near-lossless)
Config.setCodec("h264");
Config.setCrf(16);
