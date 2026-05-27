<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Global Skills & Plugins Verification Rule

Whenever starting a task, the agent MUST inspect the globally installed plugins/skills (located in the plugins config path or listed in the context description) to determine if there are specialized guidelines, tools, or best practices (e.g., `modern-web-guidance-plugin`, `web-design-guidelines`, `canvas-design`, etc.) that can help fulfill the user's request with the highest level of craftsmanship. Always verify and use these resources as a primary reference guide.
