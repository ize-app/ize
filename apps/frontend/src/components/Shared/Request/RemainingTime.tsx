// export const RemainingTime = ({
//   expirationDate,
//   result,
// }: {
//   expirationDate: Date;
//   result: ResultSummaryPartsFragment | undefined;
// }) => {
//   const now = new Date();
//   const timeLeft = expirationDate.getTime() - now.getTime();
//   const timeLeftStr = intervalToIntuitiveTimeString(timeLeft);
//   const displayRed = timeLeft < 1000 * 60 * 60 * 24;

//   if (result) {
//     return (
//       <>
//         <Chip label={"Closed"} color="secondary" size="small" />
//         <Typography>
//           Decision on{" "}
//           {expirationDate.toLocaleString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           })}
//         </Typography>
//       </>
//     );
//   } else if (timeLeft < 0) {
//     return (
//       <>
//         <Chip label={"Closed"} color="secondary" size="small" />
//         <Typography>
//           Expired on{" "}
//           {expirationDate.toLocaleString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           })}
//         </Typography>
//       </>
//     );
//   } else {
//     return (
//       <>
//         <Chip label="Open" color="primary" size="small" />
//         <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
//           <AccessAlarmIcon fontSize="small" color={displayRed ? "error" : "primary"} />
//           <Typography color={displayRed ? "error" : "primary"}>
//             {timeLeftStr} left to respond
//           </Typography>
//         </Box>
//       </>
//     );
//   }
// };
