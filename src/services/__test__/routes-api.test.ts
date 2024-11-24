import axios from "axios";
import responseFixture from "../../../test/fixtures/api-response.json";
import responseFixtureNormalized from "../../../test/fixtures/api-response-normalized.json";
import { RoutesAPI } from "../routes-api";

jest.mock("axios");

describe("RoutesAPI", () => {
  it("Should estimate the ride", async () => {
    const origin = "Ibirapuera, São Paulo - SP";
    const destination = "Liberdade, São Paulo - SP";

    axios.post = jest.fn().mockResolvedValue({ data: responseFixture });

    const routesAPI = new RoutesAPI(axios);
    const response = await routesAPI.estimateRide(origin, destination);

    expect(response).toEqual(responseFixtureNormalized);
  });

  it("Should return an ERROR when Routes API service fail", async () => {
    const origin = "Ibirapuera, São Paulo - SP";
    const destination = "Liberdade, São Paulo - SP";

    axios.post = jest.fn().mockRejectedValue("Generic error");

    const routesAPI = new RoutesAPI(axios);

    await expect(routesAPI.estimateRide(origin, destination)).rejects.toThrow(
      "Fail while trying to estimate the route: Generic error"
    );
  });
});
