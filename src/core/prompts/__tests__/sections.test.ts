import { addCustomInstructions } from "../sections/custom-instructions"
import { getCapabilitiesSection } from "../sections/capabilities"
import { DiffStrategy, DiffResult, DiffItem } from "../../../shared/tools"

describe("addCustomInstructions", () => {
	test("adds vscode language to custom instructions", async () => {
		const result = await addCustomInstructions(
			"mode instructions",
			"global instructions",
			"/test/path",
			"test-mode",
			{ language: "fr" },
		)

		expect(result).toContain("Language Preference:")
		expect(result).toContain('You should always speak and think in the "Français" (fr) language')
	})

	test("works without vscode language", async () => {
		const result = await addCustomInstructions(
			"mode instructions",
			"global instructions",
			"/test/path",
			"test-mode",
		)

		expect(result).not.toContain("Language Preference:")
		expect(result).not.toContain("You should always speak and think in")
	})
})

describe("getCapabilitiesSection", () => {
	const cwd = "/test/path"
	const mcpHub = undefined
	const mockDiffStrategy: DiffStrategy = {
		getName: () => "MockStrategy",
		getToolDescription: () => "apply_diff tool description",
		async applyDiff(_originalContent: string, _diffContents: DiffItem[]): Promise<DiffResult> {
			return { success: true, content: "mock result" }
		},
	}

	test("includes apply_diff in capabilities when diffStrategy is provided", () => {
		const result = getCapabilitiesSection(cwd, false, mcpHub, mockDiffStrategy)

		// Check that apply_diff is mentioned alongside write_to_file
		expect(result).toContain("apply_diff/write_to_file: Apply changes after analysis")
	})

	test("excludes apply_diff from capabilities when diffStrategy is undefined", () => {
		const result = getCapabilitiesSection(cwd, false, mcpHub, undefined)

		expect(result).not.toContain("apply_diff or")
		// Check that only write_to_file is mentioned for applying changes
		expect(result).toContain("write_to_file: Apply changes after analysis")
		expect(result).not.toContain("apply_diff/write_to_file") // Ensure the combined form isn't present
	})
})
