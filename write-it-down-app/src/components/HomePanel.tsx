import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useMemo } from 'react';
import { Button, View } from 'react-native';
import LoggedInContext from '../contexts/LoggedInContext';
import DocList from './DocList';
import EditPanel from './EditPanel';
import NewButton from './NewButton';
import LogoutButton from './LogoutButton';

const Stack = createStackNavigator();

const HomePanel = () => {
  const loggedIn = useContext(LoggedInContext);
  const uid = loggedIn.user!.uid;
  const docRefs = useMemo(() => firestore().collection('users').doc(uid).collection('docs'), [uid]);

  const logout = () => {
    loggedIn.clear?.apply(null);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" options={{
          headerTitle: 'Write it down',
          headerLeft: () => (<NewButton docRefs={docRefs} />),
          headerRight: () => (<LogoutButton />),
        }}>
          {itemProps => <DocList {...itemProps} docRefs={docRefs} />}
        </Stack.Screen>
        <Stack.Screen name="Edit">
          {itemProps => <EditPanel {...itemProps} docRefs={docRefs} logout={logout} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomePanel;
