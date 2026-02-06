import { MATCH_STATUS } from '../validation/matches.js';

/**
 * Determine a match's status based on start and end times relative to a reference time.
 *
 * @param {string|number|Date} startTime - Value parseable by the Date constructor representing match start.
 * @param {string|number|Date} endTime - Value parseable by the Date constructor representing match end.
 * @param {Date} [now=new Date()] - Reference time used to evaluate the status.
 * @returns {('MATCH_STATUS.SCHEDULED'|'MATCH_STATUS.LIVE'|'MATCH_STATUS.FINISHED')|null} One of the MATCH_STATUS values: `MATCH_STATUS.SCHEDULED` if `now` is before the start, `MATCH_STATUS.LIVE` if `now` is on or after the start and before the end, `MATCH_STATUS.FINISHED` if `now` is on or after the end; returns `null` if either startTime or endTime is invalid.
 */
export function getMatchStatus(startTime, endTime, now = new Date()) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    if (now < start) {
        return MATCH_STATUS.SCHEDULED;
    }

    if (now >= end) {
        return MATCH_STATUS.FINISHED;
    }

    return MATCH_STATUS.LIVE;
}

/**
 * Synchronize a match object's status with the status computed from its start and end times.
 *
 * If the computed status is invalid, the match's status is left unchanged. If the computed
 * status differs from the match's current status, `updateStatus` is invoked with the new
 * status and the match's `status` property is updated.
 *
 * @param {Object} match - The match object containing `startTime`, `endTime`, and `status` properties.
 * @param {function(string): Promise<void>} updateStatus - Async function called with the new status when an update is required.
 * @returns {string} The match's status after synchronization.
 */
export async function syncMatchStatus(match, updateStatus) {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);
    if (!nextStatus) {
        return match.status;
    }
    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }
    return match.status;
}