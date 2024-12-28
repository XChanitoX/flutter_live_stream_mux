const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/logger");
const Mux = require("@mux/mux-node");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Mux Video API
const {Video} = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET,
);

// Create a new live stream
exports.createLiveStream = onCall(async (data, context) => {
    try {
        const response = await Video.LiveStreams.create({
            playback_policy: ["public"],
            new_asset_settings: {
                playback_policy: ["public"],
            },
        });

        logger.info("Live stream created:", response);
        return response;
    } catch (error) {
        const userId = context.auth ? context.auth.uid : "unknown";
        logger.error(
            `Unable to start the live stream ${userId}. Error: ${error}`,
        );
        throw new HttpsError("aborted", "Could not create live stream");
    }
});

exports.retrieveLiveStreams = onCall(async (data, context) => {
    try {
        const liveStreams = await Video.LiveStreams.list();

        const responseList = liveStreams.map((liveStream) => ({
            id: liveStream.id,
            status: liveStream.status,
            playback_ids: liveStream.playback_ids,
            created_at: liveStream.created_at,
        }));

        logger.info("Live streams retrieved:", responseList);
        return responseList;
    } catch (error) {
        logger.error(
            `Unable to retrieve live streams. Error: ${error}`,
        );
        throw new HttpsError("aborted", "Could not retrieve live streams");
    }
});

exports.deleteLiveStream = onCall(async (data, context) => {
    try {
        const liveStreamId = data.liveStreamId;
        const response = await Video.LiveStreams.del(liveStreamId);

        logger.info(`Live stream deleted: ${liveStreamId}`);
        return response;
    } catch (error) {
        logger.error(
            `Unable to delete live stream, id: ${data.liveStreamId}. Error: ${error}`,
        );
        throw new HttpsError("aborted", "Could not delete live stream");
    }
});
