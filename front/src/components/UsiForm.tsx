import React, { useContext } from "react";
import { StateContext, DispatchContext } from "../App";
import {
  FormControl,
  FormLabel,
  Input,
  Grid,
  Box,
  Select,
  FormHelperText,
  Link,
  Icon
} from "@chakra-ui/core";

export const UsiForm: React.FC = () => {
  const state = useContext(StateContext).usiForm;
  const dispatch = useContext(DispatchContext);

  const handleFormChange = (formName: keyof typeof state) => (
    e: React.ChangeEvent<any>
  ) =>
    dispatch({
      type: "handleUsiFormChange",
      formName,
      formValue: e.target.value
    });

  const handleSampleSelected = (sample: "sample1" | "sample2" | "sample3") =>
    dispatch({
      type: "handleSfenSampleSelected",
      value: sfenSamples[sample]
    });

  return (
    <Grid templateColumns="1fr 1fr 1fr" columnGap={2} rowGap={4}>
      <FormControl gridColumn="1/4">
        <FormLabel htmlFor="sfen">局面 (SFEN)</FormLabel>
        <Grid templateColumns="120px 1fr" gap={1}>
          <Select
            id="sfenSelect"
            aria-labelledby=""
            onChange={e => handleSampleSelected(e.target.value as any)}
            defaultValue="sample1"
          >
            <option value="sample1">Sample 1</option>
            <option value="sample2">Sample 2</option>
            <option value="sample3">Sample 3</option>
          </Select>
          <Input
            id="sfen"
            value={state.sfen}
            onChange={handleFormChange("sfen")}
          />
        </Grid>
        <FormHelperText>
          <Link href="http://shogidokoro.starfree.jp/usi.html" isExternal>
            SFEN 表記法について <Icon name="external-link" mx="1px" />
          </Link>
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="byoyomi">思考時間 (sec)</FormLabel>
        <Input
          type="number"
          id="byoyomi"
          value={state.byoyomiSec}
          onChange={handleFormChange("byoyomiSec")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="multipv">候補手数</FormLabel>
        <Input
          type="number"
          id="multipv"
          value={state.multiPv}
          onChange={handleFormChange("multiPv")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="hash">置換表サイズ (MB)</FormLabel>
        <Input
          type="number"
          id="hash"
          value={state.hash}
          onChange={handleFormChange("hash")}
        />
      </FormControl>
    </Grid>
  );
};

export function preloadImages() {
  for (const sfen of Object.values(sfenSamples)) {
    const path = `http://sfenreader.appspot.com/sfen?sfen=${encodeURIComponent(
      sfen
    )}`;
    new Image().src = path;
  }
}

const sfenSamples = {
  sample1:
    "ln1g5/1r4k2/p2pppn2/2ps2p2/1p7/2P6/PPSPPPPLP/2G2K1pr/LN4G1b b BG2SLPnp 1",
  sample2:
    "+P5Bnl/2p3G1k/n6pp/p2pSpps1/2P1p4/Pl1G1S+B2/3K1P2P/7R1/LN1+r3NL b 4P2gsp 1",
  sample3:
    "lr5nl/2n3SB1/3gp2p1/3k4p/PNP2pPP1/2N3p1P/2g+p5/3P1G3/L1K4RL w G2S5Pbsp 1"
};
