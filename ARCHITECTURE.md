# MeeChain Quest System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MeeChain Quest System                        │
│                       Fallback-Aware Architecture                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         User Action Layer                            │
│  - User completes quest tasks (login, NFT minting, trading, etc.)   │
│  - Progress tracked automatically                                    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      QuestManager.ts                                 │
│                    Main Orchestrator                                 │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │ handleQuestCompletion(userId, questId)                    │     │
│  │   1. Verify Quest Conditions                              │     │
│  │   2. Attempt Primary Badge Minting                        │     │
│  │   3. On Failure → Automatic Fallback Minting             │     │
│  │   4. Log Every Step                                       │     │
│  └───────────────────────────────────────────────────────────┘     │
└──────────────┬──────────────────┬──────────────────┬────────────────┘
               │                  │                  │
               ↓                  ↓                  ↓
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Quest Verifier   │  │  Badge Minter    │  │     Logger      │
│ ═══════════════  │  │ ═══════════════  │  │ ══════════════  │
│                  │  │                  │  │                 │
│ questVerifier.ts │  │ badgeMinter.ts   │  │   logger.ts     │
│                  │  │                  │  │                 │
│ ✓ Verify         │  │ ✓ Primary Chain  │  │ ✓ Event Log     │
│   conditions     │  │   Minting        │  │ ✓ Audit Trail   │
│ ✓ Track progress │  │ ✓ Fallback Chain │  │ ✓ Error Track   │
│ ✓ Return boolean │  │   Minting        │  │ ✓ Debug Info    │
│                  │  │ ✓ Resilient      │  │                 │
└──────────────────┘  └──────────────────┘  └─────────────────┘
         │                     │                      │
         └─────────────────────┴──────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         Response Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Success    │  │  Fallback    │  │      Failure             │  │
│  │   ────────   │  │  ────────    │  │      ────────            │  │
│  │ ✓ Badge TX   │  │ ⚠ Badge TX  │  │ ✗ Error Message          │  │
│  │ ✓ Primary    │  │ ⚠ Fallback  │  │ ✗ Reason                 │  │
│  │   Chain      │  │   Chain      │  │                          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      MeeBot Integration                              │
│  ┌────────────┐      ┌────────────┐      ┌────────────────────┐    │
│  │   Happy    │      │  Confused  │      │       Sad          │    │
│  │   😊       │      │    😕      │      │       😢           │    │
│  │            │      │            │      │                    │    │
│  │ "เควส      │      │ "ระบบ     │      │ "เควสยังไม่สำเร็จ" │    │
│  │ สำเร็จ!"   │      │ fallback   │      │                    │    │
│  │            │      │ ทำงานแล้ว" │      │                    │    │
│  └────────────┘      └────────────┘      └────────────────────┘    │
│   Primary Success     Fallback Used        Quest Failed            │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     Fallback Flow Diagram                            │
└─────────────────────────────────────────────────────────────────────┘

    User Completes Quest
            │
            ↓
    ┌───────────────┐
    │ Verify Quest  │───→ Failed ───→ Return Error
    │  Conditions   │
    └───────┬───────┘
            │ Passed
            ↓
    ┌───────────────────┐
    │ Try Primary Chain │
    │    Minting        │
    └───────┬───────────┘
            │
         Success?
      ┌─────┴─────┐
      │           │
     YES          NO
      │           │
      ↓           ↓
  ┌────────┐  ┌──────────────────┐
  │ Return │  │ Try Fallback     │
  │Success │  │ Chain Minting    │
  └────────┘  └────────┬─────────┘
                       │
                    Success?
                  ┌─────┴─────┐
                  │           │
                 YES          NO
                  │           │
                  ↓           ↓
            ┌──────────┐  ┌────────┐
            │  Return  │  │ Return │
            │ Success  │  │ Error  │
            │(Fallback)│  └────────┘
            └──────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        Data Flow                                     │
└─────────────────────────────────────────────────────────────────────┘

Quest Definition
  ↓
┌─────────────────────────────────┐
│ Quest: "First Steps"            │
│ ├─ Condition: login (1)         │
│ └─ Condition: profile-setup (1) │
└─────────────────────────────────┘
  ↓
User Progress Tracking
  ↓
┌─────────────────────────────────┐
│ User: user-001                  │
│ ├─ login: 1/1 ✓                │
│ └─ profile-setup: 1/1 ✓        │
└─────────────────────────────────┘
  ↓
Quest Completion
  ↓
┌─────────────────────────────────┐
│ Badge Transaction               │
│ ├─ TX: 0x123...                │
│ ├─ Chain: Primary               │
│ └─ Timestamp: 2025-10-08        │
└─────────────────────────────────┘
  ↓
Event Logs
  ↓
┌─────────────────────────────────┐
│ Log Events:                     │
│ ├─ quest-completion-start       │
│ ├─ quest-verification-success   │
│ ├─ badge-mint-start            │
│ └─ badge-minted                │
└─────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    Key Design Principles                             │
└─────────────────────────────────────────────────────────────────────┘

1. MODULARITY
   Each component has a single, clear responsibility
   Easy to test, maintain, and extend

2. RESILIENCE
   Automatic fallback when primary systems fail
   Graceful degradation instead of complete failure

3. AUDITABILITY
   Every action is logged with full context
   Easy to trace issues and debug problems

4. TYPE SAFETY
   TypeScript ensures compile-time correctness
   Reduces runtime errors

5. EXTENSIBILITY
   Easy to add new quest types
   Simple to integrate with existing systems
   Ready for Web3, Firebase, or other backends
```
