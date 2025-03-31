"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Link as MuiLink,
  Box,
} from "@mui/material";
import { PackageSpec, Report } from "@/types";
import { fetchWorkPackage } from "@/hooks/workpackage";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { LabeledRow } from "@/components/display/LabeledRow";
import { Label } from "@mui/icons-material";
import { githubLightTheme, JsonEditor } from "json-edit-react";

const mockPackageData: Report = {
  package_spec: {
    hash: "0xc9a927b384790250ba7ad04f37c30be9f5f1d7ad570ed384f91a4169f1490cce",
    length: 270,
    erasure_root:
      "0x9359209f4dbd22fd372729b8396118296544b056e860d6b0152be6d5eda6eeb9",
    exports_root:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    exports_count: 5,
  },
  context: {
    anchor:
      "0xfac7f6164d51bb22c2668583d66a2f41eea494d55d968cb1420015f3fa6c16f6",
    state_root:
      "0xb4d540ae1f4b89ac505c2d74512cfd5f5c3c057546e234fab655f29bd1c5021f",
    beefy_root:
      "0xfee77aea940e38601cb828d2878308e32529f8382cf85f7a29b75f1c826985bc",
    lookup_anchor:
      "0xf281fbbf8e92fad492adfc61187a64c1bbf48ca83379254513fdab64cc580851",
    lookup_anchor_slot: 18,
    prerequisites: [],
  },
  core_index: 1,
  authorizer_hash:
    "0x0b27478648cd19b4f812f897a26976ecf312eac28508b4368d0c63ea949c7cb0",
  auth_output: "0x",
  segment_root_lookup: [],
  results: [
    {
      service_id: 2953942612,
      code_hash:
        "0xeded2fda1ccc4b59d6b382edb3dcd2a312925839a006199060020bd5b6165d45",
      payload_hash:
        "0x58895203656b4df71654f43d328d1cb3e10b2f5977f19cb65b84e308b43e8755",
      accumulate_gas: 1000,
      result: {
        ok: "0xaa125123e0373599cacc94075a0d7d365a6bd81a1e260c4dcabd837fe48ddafdf7050000",
      },
    },
    {
      service_id: 2953942612,
      code_hash:
        "0xeded2fda1ccc4b59d6b382edb3dcd2a312925839a006199060020bd5b6165d45",
      payload_hash:
        "0x58895203656b4df71654f43d328d1cb3e10b2f5977f19cb65b84e308b43e8755",
      accumulate_gas: 1000,
      result: {
        ok: "0xaa125123e0373599cacc94075a0d7d365a6bd81a1e260c4dcabd837fe48ddafdf7050000",
      },
    },
    {
      service_id: 2953942612,
      code_hash:
        "0xeded2fda1ccc4b59d6b382edb3dcd2a312925839a006199060020bd5b6165d45",
      payload_hash:
        "0x58895203656b4df71654f43d328d1cb3e10b2f5977f19cb65b84e308b43e8755",
      accumulate_gas: 1000,
      result: {
        ok: "0xaa125123e0373599cacc94075a0d7d365a6bd81a1e260c4dcabd837fe48ddafdf7050000",
      },
    },
    {
      service_id: 2953942612,
      code_hash:
        "0xeded2fda1ccc4b59d6b382edb3dcd2a312925839a006199060020bd5b6165d45",
      payload_hash:
        "0x58895203656b4df71654f43d328d1cb3e10b2f5977f19cb65b84e308b43e8755",
      accumulate_gas: 1000,
      result: {
        ok: "0xaa125123e0373599cacc94075a0d7d365a6bd81a1e260c4dcabd837fe48ddafdf7050000",
      },
    },
  ],
};

export default function WorkPackageDetail() {
  const router = useRouter();
  const params = useParams();
  const workPackageHash = params.workPackageHash as string;

  const [workPackageInfo, setWorkPackageInfo] =
    useState<Report>(mockPackageData);

  useEffect(() => {
    (async () => {
      const data = await fetchWorkPackage(workPackageHash, `http://${DEFAULT_WS_URL}/rpc`);
      if (!!data) {
        setWorkPackageInfo(data);
      }
    })();
  }, [workPackageHash]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Work Package Details
        </Typography>
        <Typography variant="h6" sx={{ ml: 1.5, mt: 1, fontSize: "16px" }}>
          #{workPackageHash}
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 3, marginBlock: 3 }}>
        <LabeledRow
          label="Core Index"
          tooltip="Core Index"
          value={
            <Typography
              variant="body1"
              marginInline={2}
              onClick={() => router.push(`/core/${workPackageInfo.core_index}`)}
              sx={{ cursor: "pointer" }}
            >
              {workPackageInfo.core_index}
            </Typography>
          }
        />
        <LabeledRow
          label="Services Used"
          tooltip="Services Used"
          value={
            <Box display="flex">
              {workPackageInfo.results.map((item, itemIndex) => (
                <Typography
                  key={itemIndex}
                  variant="body1"
                  marginInline={2}
                  onClick={() => router.push(`/service/${item.service_id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  {item.service_id}
                </Typography>
              ))}
            </Box>
          }
        />
        {!!workPackageInfo.context.prerequisites &&
          workPackageInfo.context.prerequisites.length > 0 && (
            <LabeledRow
              label="Prereqs"
              tooltip="prerequisites"
              value={workPackageInfo.context.prerequisites.map(
                (item, itemIndex) => (
                  <Typography
                    key={itemIndex}
                    variant="body1"
                    onClick={() => router.push(`/workpackage/${item}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    {item}
                  </Typography>
                )
              )}
            />
          )}
        <LabeledRow
          label="Availablity Spec"
          tooltip="Availablity Spec"
          value={
            <JsonEditor
              data={workPackageInfo.package_spec}
              viewOnly={true}
              collapse={true}
              theme={githubLightTheme}
              minWidth={"100%"}
              rootFontSize={"13px"}
            />
          }
        />
        <LabeledRow
          label="Refinement Context"
          tooltip="Refinement Context"
          value={
            <JsonEditor
              data={workPackageInfo.context}
              viewOnly={true}
              collapse={true}
              theme={githubLightTheme}
              minWidth={"100%"}
              rootFontSize={"13px"}
            />
          }
        />
        <LabeledRow
          label="Results"
          tooltip="Results"
          value={
            <JsonEditor
              data={workPackageInfo.results}
              viewOnly={true}
              collapse={true}
              theme={githubLightTheme}
              minWidth={"100%"}
              rootFontSize={"13px"}
            />
          }
        />
        <LabeledRow
          label="Results"
          tooltip="Results"
          value={
            <Box display="flex">
              {Array.from(
                { length: workPackageInfo.package_spec.exports_count },
                (_, i) => i
              ).map((item, itemIndex) => (
                <Typography
                  key={itemIndex}
                  variant="body1"
                  marginInline={2}
                  onClick={() =>
                    router.push(
                      `/segment/${workPackageInfo.package_spec.hash}/${item}`
                    )
                  }
                  sx={{ cursor: "pointer" }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          }
        />
      </Paper>
    </Container>
  );
}
