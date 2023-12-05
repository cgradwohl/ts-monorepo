import { createComplianceTags } from "../";
import { Stages, getStageName } from "../../get-stage-name";

jest.mock("../../get-stage-name");

describe("tags", () => {
  afterEach(() => jest.clearAllMocks);

  describe("createComplianceTags", () => {
    /** VantaContainsUserData */
    it("should set containsUserData to false by default", () => {
      const tags = createComplianceTags({
        description: "Description",
      });

      expect(tags.VantaContainsUserData).toEqual("false");
    });

    it("should allow containsUserData to be set via options", () => {
      const tags = createComplianceTags({
        containsUserData: true,
        description: "Description",
      });

      expect(tags.VantaContainsUserData).toEqual("true");
    });

    /** VantaDescription */
    it("should set the description", () => {
      const tags = createComplianceTags({
        description: "Description",
      });

      expect(tags.VantaDescription).toEqual("Description");
    });

    /** VantaNonProd */
    it("should set nonProd tag to true when in production", () => {
      jest.mocked(getStageName).mockReturnValue(Stages.Production);

      const tags = createComplianceTags({
        description: "Description",
      });

      expect(tags.VantaNonProd).toEqual("false");
    });

    it("should set nonProd tag to true when in production", () => {
      jest.mocked(getStageName).mockReturnValue(Stages.Development);

      const tags = createComplianceTags({
        description: "Description",
      });

      expect(tags.VantaNonProd).toEqual("true");
    });

    it("should allow nonProd to be set via options", () => {
      const tags = createComplianceTags({
        nonProd: false,
        description: "Description",
      });

      expect(tags.VantaNonProd).toEqual("false");
    });

    /** VantaOwner */
    it("should default the owner", () => {
      const tags = createComplianceTags({
        description: "Description",
      });

      expect(tags.VantaOwner).toEqual("seth@courier.com");
    });

    it("should allow owner to be set via options", () => {
      const tags = createComplianceTags({
        owner: "owner@courier.com",
        description: "Description",
      });

      expect(tags.VantaOwner).toEqual("owner@courier.com");
    });
  });
});
