import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../theme/AppTheme';

const TabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: 'Tabata', icon: 'timer', iconOutline: 'timer-outline' },
    { name: 'Rounds', icon: 'repeat', iconOutline: 'repeat-outline' },
    { name: 'Stopwatch', icon: 'stopwatch', iconOutline: 'stopwatch-outline' },
    { name: 'More', icon: 'menu', iconOutline: 'menu-outline' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[state.routes[index].key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index].name);
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? tab.icon : tab.iconOutline}
              size={24}
              color={isFocused ? AppTheme.colors.primary : AppTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? AppTheme.colors.primary : AppTheme.colors.textSecondary },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.background,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.gray5,
    paddingBottom: 20,
    paddingTop: AppTheme.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppTheme.spacing.xs,
  },
  label: {
    fontSize: AppTheme.typography.fontSize.xxs,
    fontWeight: AppTheme.typography.fontWeight.semiBold,
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default TabBar;
