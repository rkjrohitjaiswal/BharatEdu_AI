# BharatEdu AI - Architecture & Data Flow Diagram

Comprehensive end-to-end architecture diagram showing student learning activity, grounded RAG doubt solving, adaptive practice, teacher intelligence, and scholarship matching.

---

## High-Level Architecture Diagram

```mermaid
graph TD
    A["React 18 + Vite Frontend<br/>(TailwindCSS, i18n, Web Speech, Accessibility Context)"] -->|REST API over HTTP/JWT| B["Node.js + Express Backend"]
    
    subgraph Security & Middleware Layer
        B --> C["JWT Authentication & Role Middleware<br/>(student / teacher guards)"]
        C --> D["IDOR & Class Ownership Guards"]
    end

    subgraph Grounded AI Tutor & RAG Engine
        D -->|POST /api/tutor/messages| E["AI Orchestrator"]
        E -->|Vector Search & Similarity| F["RAG Retriever"]
        F -->|Fetch Document Chunks| G[("NCERT & Samagra Shiksha<br/>RAG Knowledge Base")]
        F -->|Context + Prompt| H["AI Provider Abstraction<br/>(OpenAI GPT-4o)"]
        H -->|Grounded Answer + Citations| E
    end

    subgraph Learning Intelligence & Practice Engine
        D -->|Answer Submission| I["Practice Controller & Security Guard"]
        I -->|Strips correctAnswer| A
        I -->|Evaluates Answer Server-Side| J["Learning Intelligence Engine"]
        J -->|Updates Mastery & Detects Gaps| K[("TopicMastery / LearningGap")]
        J -->|Calculates Risk Levels| L["Student Risk Engine"]
    end

    subgraph Teacher Intelligence Layer
        D -->|GET /api/teacher/*| M["Teacher Analytics Engine"]
        K --> M
        L --> M
        M -->|Topic Heatmaps & Interventions| A
    end

    subgraph Scholarship Intelligence Engine
        D -->|GET /api/scholarships/matches| N["Deterministic Criteria Engine"]
        O[("Grounded Scholarship Sources")] --> N
        N -->|Match Score 0-100 & Disclaimers| A
    end
```

---

## Data Flow Sequences

### 1. Grounded Doubt Solving Flow
```
Student Question ──> AI Orchestrator ──> RAG Retriever ──> NCERT Document Chunks ──> LLM Prompt ──> Grounded Answer + Source Citations
```

### 2. Adaptive Practice & Gap Detection Flow
```
Student Answer ──> Server-Side Evaluation ──> TopicMastery Update ──> Learning Gap Rule Check ──> Adaptive Next Question Difficulty Step
```

### 3. Teacher Risk & Intervention Flow
```
Learning Gaps + Mastery ──> Deterministic Risk Engine ──> At-Risk Signal ('high'/'critical') ──> Intervention Recommendation Card
```
