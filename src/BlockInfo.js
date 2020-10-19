import React, { useEffect, useState } from "react";
import { Table, Grid } from "semantic-ui-react";
import { useSubstrate } from "./substrate-lib";

export default function BlockInfo() {
  const { api } = useSubstrate();
  const [blockNumber, setBlockNumber] = useState(0);
  const [block, setBlock] = useState({});

  const bestNumber = api.derive.chain.bestNumber;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber((number) => {
      setBlockNumber(number.toNumber());
    })
      .then((unsub) => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber, api, blockNumber]);

  useEffect(() => {
    const getBlock = async () => {
      try {
        const hash = await api.rpc.chain.getBlockHash(blockNumber);
        const { block } = await api.rpc.chain.getBlock(hash);
        setBlock(block);
      } catch (err) {
        console.error(err);
      }
    };
    getBlock();
  }, [api, blockNumber]);

  return (
    <Grid.Column>
      <h1>Current Block Info</h1>
      <Table celled striped size="small">
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3} textAlign="center">
              Block Number
            </Table.Cell>
            <Table.Cell width={10}>{blockNumber}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign="center">
              Hash
            </Table.Cell>
            <Table.Cell width={10}>
              {block.header && block.header.hash.toString()}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign="center">
              Parent Hash
            </Table.Cell>
            <Table.Cell width={10}>
              {block.header && block.header.parentHash.toString()}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign="center">
              State Root
            </Table.Cell>
            <Table.Cell width={10}>
              {block.header && block.header.stateRoot.toString()}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign="center">
              Extrinsics Root
            </Table.Cell>
            <Table.Cell width={10}>
              {block.header && block.header.extrinsicsRoot.toString()}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
