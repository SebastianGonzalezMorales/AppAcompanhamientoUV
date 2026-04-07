import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#000C7B',
    flex: 1,
    paddingTop: 20,
  },

  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  title: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 20,
    left: 120,
    position: 'relative',
    right: 120,
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 18,
    marginTop: 30,
  },

  flatListContainer: {
    height: 400,
    paddingVertical: 0,
    marginTop: 0,
  },

  activitiesContainer: {
    marginLeft: 6,
    marginRight: 6,
    marginTop: 4,
  },

  activityContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 90,
    justifyContent: 'center',
    width: 80,
  },

  activityIcon: {
    marginBottom: 10,
  },

  activityText: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 12,
  },

  seeMoreText: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 12,
    marginTop: 10,
  },

  inputContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%',
  },

  text: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 13,
    textAlign: 'justify',
    marginTop: 5,
  },

  buttonContainer: {
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 30,
  },

  buttonPosition: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
  },

  questionnaireText: {
    color: '#f2f2f2',
    fontFamily: 'Actor',
    fontSize: 18,
    paddingHorizontal: 40,
    paddingTop: 30,
    textAlign: 'center',
  },

  question: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 16,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
  },

  optionContainer: {
    paddingHorizontal: 30,
  },

  selectedOption: {
    backgroundColor: '#f2f2f2',
  },

  selectedOptionText: {
    color: '#7db7ba',
  },

  smallButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },

  resultContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  resultTextOne: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 20,
  },

  resultTextTwo: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 36,
    marginTop: 30,
  },

  resultTextThree: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 20,
    marginTop: 30,
  },

  tableContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
  },

  tableHeader: {
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  tableHeaderTitle: {
    color: '#5c6169',
    fontFamily: 'DoppioOne',
    fontSize: 14,
  },

  tableColumnHeader: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },

  tableColumnText: {
    color: '#5c6169',
    fontFamily: 'DoppioOne',
    fontSize: 14,
  },

  tableRowOdd: {
    backgroundColor: 'rgba(241, 241, 254, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tableRowEven: {
    backgroundColor: 'rgba(241, 241, 254, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tableRowEnd: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  tableText: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
    fontSize: 14,
  },

  tableSubContainer: {
    marginTop: 30,
  },

  tableShadow: {
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textContainer: {
    backgroundColor: '#7db7ba',
    height: 60,
    borderRadius: 10,
    marginTop: 10,
  },

  textBox: {
    backgroundColor: '#7db7ba',
    height: 60,
    borderRadius: 10,
    marginTop: 10,
  },

  startTimeContainer: {
    backgroundColor: '#7db7ba',
    color: '#abced5',
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  dateTimePicker: {
    marginRight: 20,
    left: 0,
  },

  placeholderStyle: {
    color: '#abced5',
    fontFamily: 'DoppioOne',
    marginLeft: 20,
  },

  iconStyle: {
    marginRight: 20,
  },

  containerStyle: {
    borderRadius: 10,
    backgroundColor: '#7db7ba',
    borderColor: '#7db7ba',
  },

  itemTextStyle: {
    color: '#f2f2f2',
    fontFamily: 'DoppioOne',
  },

  selectedTextStyle: {
    color: '#fff',
    borderRadius: 10,
    marginLeft: 20,
    fontFamily: 'DoppioOne',
    fontSize: 14,
  },

  dropdownStyle: {
    marginTop: 10,
    backgroundColor: '#7db7ba',
    height: 60,
    borderRadius: 10,
  },
});
