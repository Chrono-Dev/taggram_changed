import { isNil, isEmpty } from "ramda"; 

const parseInt10 = string => parseInt(string, 10);

const isPresent = val => !isNil(val) && !isEmpty(val);

const isBlank = val => !isPresent(val);




export { parseInt10, isPresent, isBlank};