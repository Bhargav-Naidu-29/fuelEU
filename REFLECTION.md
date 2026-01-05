```markdown
# REFLECTION

Working on the FuelEU Maritime backend was a valuable exercise in combining **clean architecture principles** with **responsible AI usage**. The project required strict adherence to regulatory rules, which made it clear that AI tools must be used selectively rather than as a replacement for engineering judgment.

The most important learning was understanding **where AI adds value and where it does not**. AI agents were highly effective for scaffolding the project structure, generating repository adapters, wiring controllers, and accelerating test creation. These tasks are repetitive, well-defined, and low-risk when validated manually. Using AI in these areas significantly reduced setup time and allowed me to focus more on the core problem.

At the same time, the project reinforced that **domain logic cannot be delegated to AI**, especially in regulation-driven systems. Compliance Balance computation, banking (Article 20), and pooling (Article 21) required careful interpretation of the FuelEU specification. I intentionally implemented these parts manually to ensure correctness, traceability, and auditability. In several cases, AI suggestions were incomplete or incorrect—such as proposing GET endpoints that accepted raw compliance inputs—which highlighted the importance of critically reviewing AI output.

Another key takeaway was the importance of **clear architectural boundaries**. Enforcing Hexagonal Architecture helped isolate domain logic from frameworks and made it easier to reason about correctness and testing. AI-generated code was only accepted when it respected these boundaries; otherwise, it was corrected or discarded.

If I were to improve my workflow next time, I would invest earlier in automated contract tests and error-to-HTTP mapping to catch integration issues sooner. Overall, this project strengthened my ability to use AI as a productivity tool while maintaining full ownership of design decisions and system correctness.
```
