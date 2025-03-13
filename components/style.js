import { StyleSheet } from 'react-native';

const Moviestyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    card: {
      width: 250,
      height: 400,
      marginHorizontal: 10,
      marginBottom: 20,
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
    },
    selectedCard: {
      borderColor: 'red',
    },
    image: {
      width: 230,
      height: 300,
      borderRadius: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    releaseYear: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 5,
    },
    favoriteHeading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    favoriteCard: {
      width: '100%',
      padding: 10,
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    favoriteImage: {
      width: 340,
      height: 400,
      borderRadius: 10,
      marginBottom: 10,
    },
    favoriteTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    favoriteReleaseYear: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 5,
    },
    favoriteOverview: {
      textAlign: 'center',
    },
    noSelectionText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
    },
    refreshButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'center',
      marginTop: 20,
    },
    refreshButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    activityIndicator: {
      marginTop: 0,
    },
});

const favoriteScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    movieContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    image: {
        width: 330,
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    releaseYear: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
    },
    overview: {
        textAlign: 'center',
        marginBottom: 10,
        padding: 10,
    },
});

const Profilestyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarContainer: {
      marginRight: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    userInfoText: {
      flex: 1,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    userEmail: {
      fontSize: 16,
      color: 'gray',
    },
    settings: {
      marginTop: 30,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      paddingTop: 20,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    icon: {
      marginRight: 15,
    },
    settingText: {
      fontSize: 18,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      backgroundColor: 'red',
      paddingVertical: 15,
      borderRadius: 10,
    },
    logoutText: {
      color: 'white',
      fontSize: 18,
      marginLeft: 10,
    },
  });

export { Moviestyles, favoriteScreenStyles,Profilestyles };
