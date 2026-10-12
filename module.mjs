// @ts-check
import { module } from "@prisma/composer";
import apiServerService from "./artifacts/api-server/service.mjs";
import projectHubService from "./artifacts/project-hub/service.mjs";

export default module("nuyspoetry", ({ provision }) => {
  provision(apiServerService, { id: "apiserver" });
  provision(projectHubService, { id: "projecthub" });
});
