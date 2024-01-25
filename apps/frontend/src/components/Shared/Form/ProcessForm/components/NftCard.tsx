import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, debounce } from "@mui/material";
import {
  AlchemyApiNftContract,
  AlchemyApiNftToken,
  ApiHatToken,
  Blockchain,
  HatTokenDocument,
  NftContractDocument,
  NftTokenDocument,
} from "@/graphql/generated/graphql";
import Loading from "@/components/shared/Loading";
import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";

export const NftCard = ({
  address,
  chain,
  tokenId,
}: {
  address: string;
  chain: Blockchain;
  tokenId: string | null | undefined;
}) => {
  if (address && chain && tokenId)
    return <NftTokenCard address={address} chain={chain} tokenId={tokenId} />;
  else if (address && chain) return <NftContractCard address={address} chain={chain} />;
  else return null;
};

const NftContractCard = ({ address, chain }: { address: string; chain: Blockchain }) => {
  if (!address || !chain) return null;

  const [contract, setContract] = useState<AlchemyApiNftContract | null>(null);
  const [getContract, { loading }] = useLazyQuery(NftContractDocument, {
    variables: {
      chain,
      address,
    },
    onCompleted: (data) => {
      setContract(data.nftContract ?? null);
    },
    onError: (error) => {
      console.log("Error fetching contract: ", error);
      console.log("client error", error.clientErrors);
      console.log("protocol error", error.protocolErrors);
      console.log("graphql error", error.graphQLErrors);
      console.log("extra info", error.extraInfo);
      setContract(null);
    },
  });

  const getContractMemoized = useMemo(
    () =>
      debounce(() => {
        getContract();
      }, 100),
    [],
  );

  useEffect(() => {
    getContractMemoized();
  }, [address, chain]);

  if (loading) return <Loading />;
  else if (contract === null) return <Typography>Cannot find this collection</Typography>;

  return (
    <Card sx={{ maxWidth: "100%", margin: "16px 0px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        {contract.icon && (
          <CardMedia
            component="img"
            sx={{
              height: "100px",
              width: "100px",
            }}
            image={contract.icon}
            alt="Nft contract logo"
          />
        )}
        <CardContent sx={{ display: "flex", flexDirection: "column" }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ overflow: "hidden" }}>
            {contract.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden" }}>
            All tokens in this collection will be have access to this role
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

const NftTokenCard = ({
  tokenId,
  address,
  chain,
}: {
  tokenId: string;
  address: string;
  chain: Blockchain;
}) => {
  if (!tokenId || !address || !chain) return null;

  const [token, setToken] = useState<AlchemyApiNftToken | null>(null);
  const [getToken, { loading }] = useLazyQuery(NftTokenDocument, {
    variables: {
      chain,
      address,
      tokenId,
    },
    onCompleted: (data) => {
      setToken(data.nftToken ?? null);
    },
    onError: (error) => {
      console.log("Error fetching token", error);
      setToken(null);
    },
  });

  const getTokenMemoized = useMemo(
    () =>
      debounce(() => {
        getToken();
      }, 100),
    [],
  );

  useEffect(() => {
    getTokenMemoized();
  }, [address, chain, tokenId]);

  if (loading) return <Loading />;
  else if (token === null) return <Typography>Cannot find this NFT</Typography>;

  return (
    <Card sx={{ maxWidth: "100%", margin: "16px 0px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {token?.icon && (
          <CardMedia
            component="img"
            sx={{
              height: "120px",
              width: "120px",
            }}
            image={token.icon}
            alt="Nft contract logo"
          />
        )}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{ overflow: "hidden" }}>
            {token?.name ?? "Token of " + token?.contract.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden" }}>
            <a href="/">{token.contract.name}</a>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden" }}>
            <a href="/">Token Id: {token.tokenId}</a>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export const HatsTokenCard = ({ tokenId, chain }: { tokenId: string; chain: Blockchain }) => {
  if (!tokenId || !chain) return null;

  const [token, setToken] = useState<ApiHatToken | null>(null);
  const [getToken, { loading }] = useLazyQuery(HatTokenDocument, {
    variables: {
      chain,
      tokenId,
    },
    onCompleted: (data) => {
      setToken(data.hatToken ?? null);
    },
    onError: (error) => {
      console.log("Error fetching token", error);
      setToken(null);
    },
  });

  const getTokenMemoized = useMemo(
    () =>
      debounce(() => {
        getToken();
      }, 100),
    [],
  );

  useEffect(() => {
    getTokenMemoized();
  }, [chain, tokenId]);

  if (loading) return <Loading />;
  else if (token === null) return <Typography>Cannot find this NFT</Typography>;

  return (
    <Card sx={{ maxWidth: "100%", margin: "16px 0px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {token?.icon && (
          <CardMedia
            component="img"
            sx={{
              height: "120px",
              width: "120px",
            }}
            image={token.icon}
            alt="Nft contract logo"
          />
        )}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{ overflow: "hidden" }}>
            {token?.name}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden" }}>
            <a href="/">{token.topHatName}</a>
          </Typography> */}
          <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden" }}>
            Token Id: {token.readableTokenId}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {token.description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
