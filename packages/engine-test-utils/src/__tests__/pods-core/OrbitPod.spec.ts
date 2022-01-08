/**
 * see https://github.com/axios/axios/issues/1754
 * @jest-environment node
 */

import { URI, WorkspaceOpts } from "@dendronhq/common-all";
import { SetupHookFunction } from "@dendronhq/common-test-utils";
import {
  ImportPodPlantReturn,
  OrbitImportPod,
  OrbitImportPodConfig,
} from "@dendronhq/pods-core";
import _ from "lodash";
import { runEngineTestV5, TestEngineUtils } from "../../engine";

// jest.mock("axios");

// const utilityMethods = {
//   handleConflict: jest
//     .fn()
//     .mockReturnValue(MergeConflictOptions.OVERWRITE_LOCAL),
// };

function createFindConfig({
  config,
  query,
}: {
  config?: Partial<OrbitImportPodConfig>;
  query: OrbitImportPodConfig["query"];
}): OrbitImportPodConfig {
  const cleanConfig: OrbitImportPodConfig = {
    destName: "foo",
    method: "find",
    query,
    src: "",
    token: "token",
    vaultName: "vault",
    workspaceSlug: "workspace",
  };
  return _.merge(cleanConfig, config);
}

const setupTestFactory = ({
  fname,
  config,
}: {
  fname?: string;
  config: OrbitImportPodConfig;
}) => {
  return async (preSetupHook: SetupHookFunction) => {
    let resp: ImportPodPlantReturn;
    await runEngineTestV5(
      async (opts) => {
        const { engine, wsRoot, vaults } = opts;
        const pod = new OrbitImportPod();
        fname = fname || "alpha";
        const vault = vaults[0];
        const src = URI.parse("DUMMY");
        resp = await pod.plant({ src, engine, vault, vaults, wsRoot, config });
      },
      {
        expect,
        preSetupHook,
      }
    );
    // @ts-ignore;
    return resp;
  };
};

describe.skip("integ test", () => {
  describe("WHEN method = find", () => {
    describe("WHEN find existing member", () => {
      test("THEN get member value", async () => {
        const config = createFindConfig({
          query: {
            source: "discord",
            username: "amar#9880",
          },
        });
        const preSetupHook = async (opts: WorkspaceOpts) => {
          await TestEngineUtils.createNoteByFname({
            fname: "alpha",
            body: "",
            custom: {
              single: "one",
            },
            ...opts,
          });
        };
        const setupTest = setupTestFactory({ config });
        const resp = await setupTest(preSetupHook);
        expect(resp).toMatchSnapshot();
      });
    });
  });
});

// describe.skip("Given Orbit Import Pod", () => {
//   let response: any;
//   beforeEach(() => {
//     response = {
//       data: {
//         data: [
//           {
//             attributes: {
//               name: "John Doe",
//               github: "johndoe",
//               discord: "johndoe",
//               linkedin: null,
//               id: "sddsnjdek",
//               twitter: null,
//               hn: null,
//               website: null,
//             },
//           },
//           {
//             attributes: {
//               name: null,
//               github: "foobar",
//               discord: "foobar23",
//               linkedin: null,
//               id: "njdek",
//               twitter: null,
//               hn: null,
//               website: null,
//             },
//           },
//         ],
//         links: {
//           next: null,
//         },
//       },
//     };
//   });
//   describe("WHEN execute for a workspace", () => {
//     test("THEN all the members in orbit workspace should be imported in people.{name} hierarchy", async () => {
//       await runEngineTestV5(
//         async ({ engine, vaults, wsRoot }) => {
//           const pod = new OrbitImportPod();
//           const vaultName = VaultUtils.getName(vaults[0]);
//           const mockedAxios = axios as jest.Mocked<typeof axios>;
//           mockedAxios.get.mockResolvedValue(response);
//           const { importedNotes } = await pod.execute({
//             engine,
//             vaults,
//             wsRoot,
//             utilityMethods,
//             config: {
//               src: "orbit",
//               token: "xyzabcd",
//               vaultName,
//               workspaceSlug: "dendron-discord",
//             },
//           });
//           expect(importedNotes.length).toEqual(2);
//           expect(importedNotes[0].fname).toContain("people");
//         },
//         {
//           expect,
//           preSetupHook: ENGINE_HOOKS.setupBasic,
//         }
//       );
//     });
//   });
//   describe("WHEN name is present for an orbit member", () => {
//     test("THEN note should have people.{name} as fname", async () => {
//       await runEngineTestV5(
//         async ({ engine, vaults, wsRoot }) => {
//           const pod = new OrbitImportPod();
//           const vaultName = VaultUtils.getName(vaults[0]);
//           const mockedAxios = axios as jest.Mocked<typeof axios>;
//           mockedAxios.get.mockResolvedValue(response);
//           const { importedNotes } = await pod.execute({
//             engine,
//             vaults,
//             wsRoot,
//             utilityMethods,
//             config: {
//               src: "orbit",
//               token: "xyzabcd",
//               vaultName,
//               workspaceSlug: "dendron-discord",
//             },
//           });
//           expect(importedNotes[0].fname).toEqual("people.john-doe");
//         },
//         {
//           expect,
//           preSetupHook: ENGINE_HOOKS.setupBasic,
//         }
//       );
//     });
//   });

//   describe("WHEN name is not present for an orbit member and github attribute is not null", () => {
//     test("THEN note should have people.{github-username} as fname", async () => {
//       await runEngineTestV5(
//         async ({ engine, vaults, wsRoot }) => {
//           const pod = new OrbitImportPod();
//           const vaultName = VaultUtils.getName(vaults[0]);
//           const mockedAxios = axios as jest.Mocked<typeof axios>;
//           mockedAxios.get.mockResolvedValue(response);
//           const { importedNotes } = await pod.execute({
//             engine,
//             vaults,
//             wsRoot,
//             utilityMethods,
//             config: {
//               src: "orbit",
//               token: "xyzabcd",
//               vaultName,
//               workspaceSlug: "dendron-discord",
//             },
//           });
//           expect(importedNotes[1].fname).toEqual("people.foobar");
//         },
//         {
//           expect,
//           preSetupHook: ENGINE_HOOKS.setupBasic,
//         }
//       );
//     });
//   });

//   describe("WHEN name is not present for an orbit member and only email is not null", () => {
//     test("THEN note should have people.{email} as fname", async () => {
//       await runEngineTestV5(
//         async ({ engine, vaults, wsRoot }) => {
//           const pod = new OrbitImportPod();
//           const vaultName = VaultUtils.getName(vaults[0]);
//           response.data.data.push({
//             attributes: {
//               name: null,
//               github: null,
//               discord: null,
//               linkedin: null,
//               id: "sddsnjdek",
//               twitter: null,
//               hn: null,
//               website: null,
//               email: "fooxyz@gmail.com",
//             },
//           });
//           const mockedAxios = axios as jest.Mocked<typeof axios>;
//           mockedAxios.get.mockResolvedValue(response);
//           const { importedNotes } = await pod.execute({
//             engine,
//             vaults,
//             wsRoot,
//             utilityMethods,
//             config: {
//               src: "orbit",
//               token: "xyzabcd",
//               vaultName,
//               workspaceSlug: "dendron-discord",
//             },
//           });
//           expect(importedNotes[2].fname).toEqual("people.fooxyz");
//         },
//         {
//           expect,
//           preSetupHook: ENGINE_HOOKS.setupBasic,
//         }
//       );
//     });

//     describe("WHEN name is not present for an orbit member and all attributes are null", () => {
//       test("THEN no new note is created for that entry", async () => {
//         await runEngineTestV5(
//           async ({ engine, vaults, wsRoot }) => {
//             const pod = new OrbitImportPod();
//             const vaultName = VaultUtils.getName(vaults[0]);
//             const mockedAxios = axios as jest.Mocked<typeof axios>;
//             response.data.data.push({
//               attributes: {
//                 name: null,
//                 github: null,
//                 discord: null,
//                 linkedin: null,
//                 id: "sddsnjdek",
//                 twitter: null,
//                 hn: null,
//                 website: null,
//               },
//             });
//             mockedAxios.get.mockResolvedValue(response);
//             const { importedNotes } = await pod.execute({
//               engine,
//               vaults,
//               wsRoot,
//               utilityMethods,
//               config: {
//                 src: "orbit",
//                 token: "xyzabcd",
//                 vaultName,
//                 workspaceSlug: "dendron-discord",
//               },
//             });
//             expect(importedNotes.length).toEqual(2);
//           },
//           {
//             expect,
//             preSetupHook: ENGINE_HOOKS.setupBasic,
//           }
//         );
//       });
//     });
//   });
// });
