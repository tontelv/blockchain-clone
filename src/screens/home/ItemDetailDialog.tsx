import React, { FC, useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { Chart, Line, Area, Tooltip } from "react-native-responsive-linechart";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import WeekSegmentItem from "../../components/WeekSegmentItem";

import Colors from "../../constants/Colors";
import DetailDialogItem from "./DetailDialogItem";
import ItemDetailPropertyDialog from "./ItemDetailPropertyDialog";
import { getCoinData, getCoinHistory } from "../../utils/utils";

interface ItemDetailDialogProps {
  id: number;
  itemSymbol: string;
  onItemClicked: () => void;
}

const ItemDetailDialog: FC<ItemDetailDialogProps> = ({
  id,
  itemSymbol,
  onItemClicked,
}) => {
  const [coinData, setCoinData] = useState<Number[]>([0, 0, 0]);
  const [graph, setGraph] = useState<any[]>([]);
  const [graphMinMax, setGraphMinMax] = useState({
    max: 3450,
    min: 3300,
  });
  const [showItemPropertyDialog, setShowItemPropertyDialog] = useState({
    isVisible: false,
    id: 0,
    children: (
      <MaterialCommunityIcons
        name="arrow-top-right-bottom-left"
        size={22}
        color="#FF911C"
      />
    ),
  });
  const loadData = useCallback(async () => {
    try {
      const coinDataResponse = await getCoinData(itemSymbol);
      const response = await getCoinHistory(itemSymbol, 300);
      let graphData: { x: any; y: any }[] = [];
      response.forEach((element: any, index: any) => {
        graphData.push({ x: index, y: element });
      });
      setGraph(graphData);
      const max = Math.max(...response);
      const min = Math.min(...response);

      setGraphMinMax({
        ...graphMinMax,
        ...{ max: parseInt(max.toString()), min: parseInt(min.toString()) },
      });
      setCoinData(coinDataResponse);
    } catch (e) {}
  }, []);

  useEffect(() => {
    loadData();
  }, []);
  return (
    <Modal
      isVisible={true}
      animationInTiming={500}
      style={styles.container}
      hasBackdrop={true}
      backdropOpacity={0.1}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.txtCoinTitle}>Current {itemSymbol} Price</Text>
        <Text style={styles.txtPriceTitle}>${coinData[0]}</Text>
        <View style={styles.percentContainer}>
          <Text style={styles.txtPercent}>{coinData[1].toFixed(2)}%</Text>
          <Text style={styles.txtWeek}>1 week</Text>
        </View>
      </View>

      {graph.length !== 0 && (
        <Chart
          style={{ height: 120, width: "100%", marginTop: 0 }}
          data={graph}
          padding={{ left: 0, bottom: 20, right: 0, top: 0 }}
          xDomain={{ min: 0, max: 300 }}
          yDomain={{ min: graphMinMax.min, max: graphMinMax.max }}
        >
          <Line
            theme={{ stroke: { color: "#159262", width: 1 } }}
            tooltipComponent={
              <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
            }
          />
          <Area
            theme={{
              gradient: {
                from: { color: "#159262", opacity: 0.6 },
                to: { color: "#159262", opacity: 0.05 },
              },
            }}
          />
        </Chart>
      )}

      <View style={styles.segmentContainer}>
        <WeekSegmentItem />
      </View>

      <ScrollView style={styles.scrollViewContainer}>
        <DetailDialogItem
          itemKey="Private Key Wallte"
          itemTitle="Bitcoin"
          itemBalance={0.0000064}
          itemSymbol="BTC"
          itemPrice={4444}
          id={id}
          children={
            <MaterialCommunityIcons name="key" size={12} color="white" />
          }
          onItemClick={(coinId: string) => {
            setShowItemPropertyDialog({
              ...showItemPropertyDialog,
              ...{
                isVisible: true,
                id: id,
                children: (
                  <MaterialCommunityIcons name="key" size={12} color="white" />
                ),
              },
            });
          }}
        />

        <DetailDialogItem
          itemKey="Trading Account"
          itemTitle="Bitcoin"
          itemBalance={0.000045}
          itemSymbol="BTC"
          itemPrice={234}
          id={id}
          children={
            <MaterialCommunityIcons
              name="arrow-top-right-bottom-left"
              size={12}
              color="white"
            />
          }
          onItemClick={(coinId: string) => {
            setShowItemPropertyDialog({
              ...showItemPropertyDialog,
              ...{
                isVisible: true,
                id: id,
                children: (
                  <MaterialCommunityIcons
                    name="arrow-top-right-bottom-left"
                    size={12}
                    color="white"
                  />
                ),
              },
            });
          }}
        />
      </ScrollView>

      <TouchableOpacity style={styles.btnContainer} activeOpacity={0.8}>
        <Text style={styles.txtBtn}>Buy Bitcoin</Text>
      </TouchableOpacity>

      {showItemPropertyDialog.isVisible && (
        <ItemDetailPropertyDialog
          id={showItemPropertyDialog.id}
          children={showItemPropertyDialog.children}
          onActivityClicked={() => {
            setShowItemPropertyDialog({
              ...showItemPropertyDialog,
              ...{ isVisible: !showItemPropertyDialog.isVisible },
            });
            onItemClicked();
          }}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    marginTop: 32,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 8,
  },
  txtCoinTitle: {
    color: Colors.accentColor_100,
    fontSize: 16,
  },
  txtPriceTitle: {
    color: Colors.accentColor,
    fontSize: 28,
    fontFamily: "Roboto-Medium",
  },
  percentContainer: {
    flexDirection: "row",
  },
  txtPercent: {
    color: "#4D8F79",
    fontFamily: "Roboto-Medium",
    fontSize: 14,
  },
  txtWeek: {
    color: Colors.accentColor_100,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
  },
  segmentContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  btnContainer: {
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 12,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  scrollViewContainer: {
    paddingTop: 8,
  },
  txtBtn: {
    color: "white",
    fontSize: 20,
    fontFamily: "Roboto-Medium",
  },
});
export default ItemDetailDialog;
