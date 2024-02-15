import * as React from "react";

import { Control, UseFormWatch, FieldValues } from "react-hook-form";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  AlchemyApiNftContract,
  Blockchain,
  SearchNftContractsDocument,
} from "@/graphql/generated/graphql";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";

interface NftContractSearchProp {
  control: Control;
  name: string;
  chain: Blockchain;
  watch: UseFormWatch<FieldValues>;
}

export const NftContractSearch = ({ name, control, chain, watch }: NftContractSearchProp) => {
  //   const [searchNftContracts, { loading, data }] = useLazyQuery(SearchNftContractsDocument);


  //   const [value, setValue] = React.useState<PlaceType | null>(null);
  //   const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<AlchemyApiNftContract[]>([]);

  return (
    <>
      <Autocomplete
        id="google-map-demo"
        sx={{ width: 300 }}
        getOptionLabel={(option: AlchemyApiNftContract) => option.name ?? option.address}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        //   value={value} // I think i delete this for react hook forms
        noOptionsText="No locations"
        //   onChange={(_event, data) => field.onChange(data)}
        //   onChange={(event: any, newValue: PlaceType | null) => {
        //     setOptions(newValue ? [newValue, ...options] : options);
        //     setValue(newValue);
        //   }}
        //   onInputChange={(event, newInputValue) => {
        //     setInputValue(newInputValue);
        //   }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"NFT collection"}
            variant="outlined"
            placeholder="Search by collection name or address"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
            //   error={Boolean(error)}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Typography>{option.name ?? option.address}</Typography>\
            </li>
          );
        }}
      />
      <Button
      // onClick={() =>
      //   searchNftContracts({
      //     variables: {
      //       query: "sup",
      //       chain: chain,
      //     },
      //   })
      // }
      >
        Test
      </Button>
    </>
  );
};
