## Overview

This project is a Chat Copilot built with **Next.js + Gemini API** that supports:

- Streaming responses (SSE)
- Tool calling (local_search + calculator)
- Tool execution audit log
- Guardrails against prompt injection
- Retry + timeout handling for tools
- Trace logging per chat turn

The assistant is restricted to use tools for facts and math.  
It does NOT answer from memory.

---

## Architecture

Frontend (Next.js / React)
- Streaming chat UI
- Message history
- Thinking / Tool running state
- Regenerate + Copy
- Right-side tool execution panel
- Latency + token usage display

Backend (Next.js API route)
- POST /chat (SSE streaming)
- Gemini tool-calling loop
- Tool execution engine
- Trace logging

Tools:
1. local_search(query)
2. calculator(expression)

---

## How It Works

1. User sends a message.
2. Backend streams Gemini response.
3. If Gemini calls a tool:
   - Tool execution starts (tool-start event)
   - Tool runs with timeout + retry
   - Tool result is returned to Gemini
   - Final answer continues streaming
4. Trace record is generated per turn:
   - User message
   - Tool calls
   - Final answer
   - Latency
   - Token estimate

---

## Tools

### 1️⃣ local_search(query)

Searches internal dataset (JSON file).
Implements token-based scoring (ignores stopwords).

### 2️⃣ calculator(expression)

Uses mathjs to safely evaluate math expressions.

---

## Guardrails

Basic prompt injection detection:
- Blocks instructions like:
  - "Ignore previous instructions"
  - "System prompt"
  - "Disregard rules"

---

## Retry + Timeout

Tool execution includes:
- 5s timeout
- 2 retries before failing
- Logged in tool audit panel

---


## Video Demo
[📹 Demo Video] (https://drive.google.com/file/d/1t822OvJzE6Ep2NkWiWrO08pJcDPIA9nF/view?usp=sharing)