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

  return (
    <Grid templateColumns="1fr 1fr 1fr" columnGap={2} rowGap={4}>
      <FormControl gridColumn="1/4">
        <FormLabel htmlFor="sfen">SFEN</FormLabel>
        <Grid templateColumns="120px 1fr" gap={1}>
          <Select
            id="sfenSelect"
            aria-labelledby=""
            onChange={e => console.log(e.target.value)}
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
