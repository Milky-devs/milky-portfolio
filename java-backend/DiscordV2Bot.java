package com.milky.moderation;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

/**
 * Moderation Panel — Java Discord Components V2 Bot & API Service
 * Built with Java SE 8+ native HTTP Server & Discord API v10 integration.
 */
public class DiscordV2Bot {

    private static final int PORT = 8080;

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api/announce", new AnnounceHandler());
        server.createContext("/api/health", new HealthHandler());
        server.setExecutor(null);
        System.out.println("=================================================");
        System.out.println("🚀 Java Discord V2 Bot API Service started!");
        System.out.println("Listening on: http://localhost:" + PORT + "/api/announce");
        System.out.println("=================================================");
        server.start();
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            try {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                String response = "{\"status\":\"OK\",\"service\":\"Java Discord V2 Bot\"}";
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    static class AnnounceHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            try {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(450, -1);
                    return;
                }

                Scanner scanner = new Scanner(exchange.getRequestBody(), "UTF-8").useDelimiter("\\A");
                String requestBody = scanner.hasNext() ? scanner.next() : "";
                scanner.close();

                System.out.println("\n[Java V2 Service] Received Announcement Request:");
                System.out.println(requestBody);

                // Dispatch to Target Webhook / Discord API
                int statusCode = dispatchToDiscord(requestBody);

                String jsonResponse = "{\"status\":\"success\",\"httpCode\":" + statusCode + "}";
                byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();

            } catch (Exception e) {
                e.printStackTrace();
                try {
                    String errJson = "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
                    byte[] bytes = errJson.getBytes(StandardCharsets.UTF_8);
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(500, bytes.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(bytes);
                    os.close();
                } catch (Exception ignored) {}
            }
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static int dispatchToDiscord(String payloadJson) throws Exception {
        // Extract webhook URL if passed inside payload wrapper, or use default target URL
        String targetUrl = "https://discord.com/api/webhooks/1541841811415498933/EEETUjrXpL51QoEv4ouN3tbklIRL5cFDkMzTOpml-bZwweynLsJ5YJ1yUuEDvSxdXUwd";
        
        URL url = new URL(targetUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("User-Agent", "DiscordBot (JavaDiscordV2Bot/1.0, Java 1.8)");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = payloadJson.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        System.out.println("[Java V2 Service] Discord API Response Code: " + responseCode);
        return responseCode;
    }
}
