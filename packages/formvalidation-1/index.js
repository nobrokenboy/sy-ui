import validateGroup from './validateGroup.vue';
import validateField from './validateField.vue';


validateGroup.install = function(Vue) {
    Vue.component(validateGroup.name, validateGroup);
};

validateField.install = function(Vue) {
    Vue.component(validateField.name, validateField);
};

export {
    validateGroup,
    validateField
};