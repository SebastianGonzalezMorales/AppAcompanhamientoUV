import { StatusBar, StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  androidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  container: {
    backgroundColor: '#000C7B',
    flex: 1,
  },

  rowTwo: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },

  titleWhite: {
    color: '#000C7B',
    fontFamily: 'DoppioOne',
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'justify',
  },

  titleWhitee: {
    color: '#fff',
    fontFamily: 'DoppioOne',
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'justify',
  },

  subtitleBlack: {
    color: '#5c6169',
    fontFamily: 'DoppioOne',
    fontSize: 16,
    paddingTop: 5,
    textAlign: 'justify',
  },

  outerContainer: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    borderWidth: 2,
    borderColor: '#000C7B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 20,
  },

  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },

  storiesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 10,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 80,
  },

  welcomeText: {
    color: '#f2f2fc',
    fontFamily: 'DoppioOne',
    fontSize: 20,
    paddingLeft: 30,
    paddingTop: 20,
  },

  subtitle: {
    color: '#f2f2fc',
    fontFamily: 'DoppioOne',
    fontSize: 16,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    textAlign: 'justify',
  },

  subtitleMenu: {
    color: '#f2f2fc',
    fontFamily: 'DoppioOne',
    fontSize: 15,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    textAlign: 'justify',
  },

  text: {
    color: '#f2f2fc',
    fontFamily: 'DoppioOne',
    fontSize: 14,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    textAlign: 'justify',
  },

  moodsContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  statsTitle: {
    color: '#5c6169',
    fontFamily: 'DoppioOne',
    fontSize: 16,
    paddingTop: 26,
  },

  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circularButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 30,
    marginBottom: 30,
  },

  line: {
    marginTop: 20,
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    marginLeft: 30,
    marginRight: 215,
  },

  calendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  selectDate: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  daysContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  daysText: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 14,
  },

  counsellingLine: {
    marginTop: 20,
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
  },

  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#f2f2fc',
  },

  responseBox: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },

  buttonIcon: {
    fontSize: 18,
    color: '#00796B',
  },

  sectionContent: {
    textAlign: 'justify',
    color: '#424242',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 1,
    paddingVertical: 5,
  },
});
