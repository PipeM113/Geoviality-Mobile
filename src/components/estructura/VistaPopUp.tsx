import { StyleSheet, View, Modal, ViewStyle } from "react-native";

import { contentStyles, popupStyles } from "@src/constants/uiStyles";

type Props = {
  esVisible: boolean;
  onRequestClose: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
};

function VistaPopUp(props: Props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.esVisible} onRequestClose={props.onRequestClose}>
      <View style={[popupStyles.container, props.style]}>{props.children}</View>
    </Modal>
  );
}

export default VistaPopUp;
