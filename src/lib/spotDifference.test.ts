import { test } from "node:test";
import assert from "node:assert/strict";
import { canSubmitDifferences, differenceCount, differenceScreens, differenceSetupValid, type SpotDifferenceContent } from "./spotDifference";

const activity: SpotDifferenceContent = {
  type: "spot_difference", reference_url: "original.png", comparison_url: "comparison.png", total_differences: 3,
  hotspots: ["a", "b", "c"].map((id, i) => ({ id, x: i * 20, y: 50, label: id })),
};
test("submission is blocked until every configured difference is found", () => {
  assert.equal(canSubmitDifferences(activity, ["a", "b"]), false);
  assert.equal(canSubmitDifferences(activity, ["a", "b", "c"]), true);
});
test("duplicates and unknown locations do not count as differences", () => {
  assert.equal(differenceCount(activity, ["a", "a", "unknown"]), 1);
  assert.equal(canSubmitDifferences(activity, ["a", "b", "unknown"]), false);
});
test("total must match the marked locations and both images are required", () => {
  assert.equal(differenceSetupValid({ ...activity, total_differences: 8 }), false);
  assert.equal(differenceSetupValid({ ...activity, reference_url: "" }), false);
  assert.equal(differenceSetupValid({ ...activity, comparison_url: "" }), false);
  assert.equal(differenceSetupValid(activity), true);
});
test("both side screens always receive the same comparison definition", () => {
  const screens = differenceScreens(activity);
  assert.deepEqual(screens.screen1_content, screens.screen2_content);
  assert.equal(screens.screen1_content.comparison_url, "comparison.png");
  assert.equal(screens.host_content.reference_url, "original.png");
});