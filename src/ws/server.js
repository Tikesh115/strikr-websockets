import WebSocket, { WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

const matchSubscribers = new Map();

function subscribe(matchId, socket) {
    if (!matchSubscribers.has(matchId)) {
        matchSubscribers.set(matchId, new Set());
    }
    matchSubscribers.get(matchId).add(socket);
    console.log('[ws] subscribed', { matchId, total: matchSubscribers.get(matchId).size });
}

function unsubscribe(matchId, socket) {
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers) return;

    subscribers.delete(socket);

    console.log('[ws] unsubscribed', { matchId, total: subscribers.size });

    if(subscribers.size === 0) {
        matchSubscribers.delete(matchId);
    }
}

function cleanupSubscriptions(socket) {
    for(const matchId of socket.subscriptions) {
        unsubscribe(matchId, socket);
    }
}

//guard function
function sendJson(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function broadcastToAll(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;

        client.send(JSON.stringify(payload));
    }
}

function broadcastToMatch(matchId, payload) {
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers || subscribers.size === 0) return;

    const message = JSON.stringify(payload);
    console.log('[ws] broadcast', { matchId, count: subscribers.size, type: payload?.type });
    for(const client of subscribers) {
        if(client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

function handleMessage(socket, data) {
    let message;

    try {
        message = JSON.parse(data.toString());
    } catch (error) {
        sendJson(socket, { type: 'error', message: 'Ivalid JSON' });
    }

    if(message?.type === "subscribe" && Number.isInteger(message.matchId)) {
        subscribe(message.matchId, socket);
        socket.subscriptions.add(message.matchId);
        sendJson(socket, { type: 'subscribed', matchId: message.matchId});
        return;
    }

    if(message?.type === "unsubscribe" && Number.isInteger(message.matchId)) {
        unsubscribe(message.matchId, socket);
        socket.subscriptions.delete(message.matchId);
        sendJson(socket, { type: 'unsubscribe', matchId: message.matchId});
        return;
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 1024 * 1024});

    wss.on('connection', async (socket, request) => {
        const isDev = process.env.NODE_ENV !== 'production';
        const remoteAddress = request.socket?.remoteAddress;
        const isLocalhost = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remoteAddress);

        if (wsArcjet && !(isDev && isLocalhost)) {
            try {
                const decision = await wsArcjet.protect({ request, socket });
                if (decision.isDenied) {
                    const isRateLimit = decision.reason.isRateLimit();
                    const code = isRateLimit ? 1013 : 1008; // 1013: Try Again Later, 1008: Policy Violation
                    const reason = isRateLimit ? 'Rate limit exceeded' : 'Access denied';

                    socket.close(code, reason);
                    return;
                }
            } catch (error) {
                console.error('Websocket Arcjet error:', error);
                socket.close(1011, 'Server security error'); // 1011: Internal Error
                return;
            }
        }
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });

        socket.subscriptions = new Set();

        sendJson(socket, { type: 'welcome' });

        socket.on('message', (data) => {
            handleMessage(socket, data);
        })
        
        socket.on('error', () => {
            socket.terminate();
        });

        socket.on('close', () => {
            cleanupSubscriptions(socket);
        })

        socket.on('error', console.error);
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        })
    }, 30000);

    wss.on('close', () => clearInterval(interval));

    function broadcastMatchCreated(match) {
        broadcastToAll(wss, { type: 'match_created', data: match})
    }

    function broadcastCommentary(matchId, comment) {
        broadcastToMatch(matchId, {type: 'commentary', data: comment})
    }

    return { broadcastMatchCreated, broadcastCommentary };
}