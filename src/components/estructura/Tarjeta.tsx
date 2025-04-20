import { View, ViewStyle, Text, TextStyle } from "react-native";

import { cardStyles, contentStyles } from "@src/constants/uiStyles";

type Props = {
  children: React.ReactNode;
  centrado?: boolean;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  titulo?: string;
  titleStyle?: TextStyle;
};

// TODO: documentar esto
const Tarjeta = (props: Props) => {
  const renderTitle = () => {
    if (props.titulo) {
      return <Text style={[cardStyles.titleText, props.titleStyle]}>{props.titulo}</Text>;
    } else {
      return null;
    }
  };

  if (props.centrado) {
    return (
      <View style={[cardStyles.container, props.style]}>
        {renderTitle()}
        <View style={[contentStyles.containerCentered, props.containerStyle]}>{props.children}</View>
      </View>
    );
  } else {
    return (
      <View style={[cardStyles.container, props.style]}>
        {renderTitle()}
        <View style={[contentStyles.container, props.containerStyle]}>{props.children}</View>
      </View>
    );
  }
};

export default Tarjeta;
