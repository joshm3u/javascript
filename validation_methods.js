/*
 * Extra Validation methods to be included when validating a form using the jQuery Validation plugin
 * More info about the plugin can be found here: http://jqueryvalidation.org/
 */

/**
 * Run validation on preflight steps
 * Simple Validation -> Check if there are any invalid preflight steps, used when user
 *   removes focus from step section
 * Detailed Validation -> Go through all of the preflight steps and preform validations. Used
 *   when submitting create CM form to ensure correct values/Improved UX
 * @param  {[Boolean]} simple, To run simple or more detailed step validation
 */
function validatePreflightSteps(simple) {
    if (simple) {
        if ($(".preflight-step.active_element").length === 0) {
            return true;
        }
        return isCurrentPreflightStepValid() && $(".preflight-step.invalid_element").length === 0;
    } else {
        hidePreflightStepFields();
        var invalidStep;
        $("#preflightStepList li").each(function() {
            setActivePreflightStep($(this));
            if (!isCurrentPreflightStepValid()) {
                if (isNullOrUndefined(invalidStep)) {
                    invalidStep = $(this);
                }
            }
        });
        if (isNullOrUndefined(invalidStep)) {
            deselectActivePreflightStep();
            setSectionToValid($("#cm-preflight-step-fields").children(".validation-section"));
            return true;
        } else {
            setActivePreflightStep(invalidStep);
            setSectionToInvalid($("#cm-preflight-step-fields").children(".validation-section"));
            isCurrentPreflightStepValid();
            return false;
        }
    }
}

/**
 * Run validation on steps
 * Simple Validation -> Check if there are any invalid steps, used when user
 *   removes focus from step section
 * Detailed Validation -> Go through all of the steps and preform validations. Used
 *   when submitting create CM form to ensure correct values/Improved UX
 * @param  {[Boolean]} simple, To run simple or more detailed step validation
 */
function validateSteps(simple) {
    if (simple) {
        if ($(".step.active_element").length === 0) {
            return true;
        }
        return isCurrentStepValid() && $(".step.invalid_element").length === 0;
    } else {
        hideStepFields();
        var invalidStep;
        $("#stepList li").each(function() {
            setActiveStep($(this));
            if (!isCurrentStepValid()) {
                if (isNullOrUndefined(invalidStep)) {
                    invalidStep = $(this);
                }
            }
        });
        if (isNullOrUndefined(invalidStep)) {
            deselectActiveStep();
            setSectionToValid($("#cm-step-fields").children(".validation-section"));
            return true;
        } else {
            setActiveStep(invalidStep);
            setSectionToInvalid($("#cm-step-fields").children(".validation-section"));
            isCurrentStepValid();
            return false;
        }
    }
}

/**
 * Run validation on custom fields
 * Simple Validation -> Check if there are any invalid custom fields, used when user
 *   removes focus from custom field section
 * Detailed Validation -> Go through all of the custom fields and preform validations. Used
 *   when submitting create CM form to ensure correct values/Improved UX
 * @param  {[Boolean]} mode, To run simple or more detailed custom fields validation
 */
function validateCustomFields(mode) {
    if (mode) {
        if ($(".custom-field.active_element").length === 0) {
            return true;
        }
        return isCurrentCustomFieldValid() && $(".custom-field.invalid_element").length === 0;
    } else {
        hideCustomFieldDetails();
        var invalidCustomField;
        $("#customFieldList li").each(function() {
            setActiveCustomField($(this));
            if (!isCurrentCustomFieldValid()) {
                if (isNullOrUndefined(invalidCustomField)) {
                    invalidCustomField = $(this);
                }
            }
        });
        if (isNullOrUndefined(invalidCustomField)) {
            deselectActiveCustomField();
            setSectionToValid($("#cm-custom-field-fields").children(".validation-section"));
            return true;
        } else {
            setActiveCustomField(invalidCustomField);
            setSectionToInvalid($("#cm-custom-field-fields").children(".validation-section"));
            isCurrentCustomFieldValid();
            return false;
        }
    }
}

/*
 * Styles a Create Cm Section as valid
 * @param {[Dom Element]} section, Section to be styled
 */
function setSectionToValid(section) {
    $(section).switchClass("active_element invalid_element", "valid_element", 300);
    $(section).find(".white-checkmark").removeClass("display-none", 200);
    $(section).find(".white-x").addClass("display-none", 200);
}
/*
 * Styles a Create Cm Section as invalid
 * @param {[Dom Element]} section, Section to be styled
 */
function setSectionToInvalid(section) {
    $(section).switchClass("active_element valid_element", "invalid_element", 300);
    $(section).find(".white-checkmark").addClass("display-none", 200);
    $(section).find(".white-x").removeClass("display-none", 200);
}

function initValidation() {
    $(".validation-section").focusin(function() {
        $(this).switchClass("valid_element invalid_element", "active_element", 300);
        $(this).find(".white-checkmark").addClass("display-none", 100);
        $(this).find(".white-x").addClass("display-none", 100);
    });

    /*
     * Taken from stackoverflow: http://tiny/zmba0h9g/stacques1827jque
     * Wrapper for each validation method that trims the value and then calls
     *   the validation method with the trimmed value
     * For clarity:
     *   value: validation method
     *   arguments[0]: value to be validated
     */
    $.each($.validator.methods, function (key, value) {
        $.validator.methods[key] = function () {
            if(arguments.length > 0) {
                arguments[0] = $.trim(arguments[0]);
            }

            return value.apply(this, arguments);
        };
   });

}

/*
 * Validation for text fields expecting a valid Amazon login / email
 */
function addLoginValidationMethod() {
    jQuery.validator.addMethod("login", function(value, element) {
        return this.optional(element) || AMAZON_ID_REGEX.test(value) || RFC2822_REGEX.test(value);
    }, "Approver Value must be an Amazon ID (lower case letters,<BR/>numbers, dashes and underscores) or valid email address");
}

/*
 * Validation for a set of start/end datepickers that the start date comes before the end date
 * durationId -> Couples 2 datePickers into a durationDatePicker
 */
function addDurationDatePickerValidtionMethod() {
    jQuery.validator.addMethod("durationDatePicker", function(value, element) {
	//momentJS formats can be found in datetime-common.js
        var end_date = moment(value, momentJsParserFormat);
	var start_date = moment($(".start-date[data-duration-id = " + $(element).data("duration-id") + "]").val(), momentJsParserFormat);
	if (end_date.isValid() && start_date.isValid()) {
            return end_date > start_date;
        }
        return true;
    } , "Scheduled Start must be before Scheduled End");

   /*
    * Work around so validation is performed when time(hrs or min) is adjusted
    * Jquery Validator doesn't register a change in time as a change in the date picker value
    * So explicately tell the Validator to validate on any value change
    */
    $(".start-date, .end-date").change(function() {
        if ($.trim($(".start-date[data-duration-id = " + $(this).data("duration-id") + "]").val()).length &&
        $.trim($(".end-date[data-duration-id = " + $(this).data("duration-id") + "]").val()).length) {
            $(".validated_form").validate().element($(".end-date[data-duration-id = " + $(this).data("duration-id") + "]"));
        }
    });
}
/*
 * Validation for a number field expecting a positive number
 */
function addGreaterThanOrEqualToZeroValidationMethod() {
    jQuery.validator.addMethod("greaterThanOrEqualToZero", function(value, element) {
        var stepDuration = parseFloat(value);
            if (isNaN(stepDuration)) {
                return false;
            }
        return (this.optional(element)) || (isFinite(stepDuration) && stepDuration >= 0);
    }, "Must be greater than or equal to 0");
}
/*
 * Validation for a number field expecting an integer
 */
function addIsIntegerValidationMethod() {
    jQuery.validator.addMethod("integer", function(value, element) {
        return isInt(parseFloat(value));
    }, "Must be an integer");
}

/*
 * Validation for the approver text field expecting an approver that has not already been added
 */
function addUniqueApproverValidationMethod() {
    jQuery.validator.addMethod("approver", function(value, element) {
        return this.optional(element) || !approverLoginSet[$(element).val().trim().toLowerCase()];
    }, "Approver already added");
}

/*
 * Validation for a text field should contain less than 1000 characters
 */
function textMaxLength1000ValidationMethod() {
    jQuery.validator.addMethod("noLongerThan1000", function(value, element) {
        return this.optional(element) || $(element).val().trim().length <= 1000;
    }, "This field must not exceed 1000 characters");
}

/*
 * Validation for a text field should contain less than 12000 characters
 */
function textMaxLength12000ValidationMethod() {
    jQuery.validator.addMethod("noLongerThan12000", function(value, element) {
        return this.optional(element) || $(element).val().trim().length <= 12000;
    }, "This field must not exceed 12000 characters");
}

/*
 * Validate Scheduled end override in steps is valid
 */
function scheduledEndOverrideValidationMethod() {
    jQuery.validator.addMethod("scheduledEndOverride", function(value, element) {
        var scheduled_end_copy = moment(value, momentJsParserFormat);
        var scheduled_start = moment($("#scheduled_start").val(), momentJsParserFormat);
        if (scheduled_end_copy.isValid() && scheduled_start.isValid()) {
            return scheduled_end_copy > scheduled_start;
        }
    }, function(params, element) {
        return "Must be after scheduled start ( "+ $("#scheduled_start").val() + " - " + getTimezoneNumericString() + ")"
    });
}
/*
 * Validate Scheduled end overflows due to large cumulative step duration
 */
function scheduledEndOverflowValidationMethod() {
    jQuery.validator.addMethod("scheduledEndOverflow", function(value, element) {
        var computedScheduledEnd = computeScheduledEnd();
        return computedScheduledEnd !== "overflow";
    }, "Step Duration too large");
}
/*
 *  Warn users start date is required for auto-calculation to work
 */
function warnScheduledStartRequiredValidationMethod() {
    jQuery.validator.addMethod("warnScheduledStartRequired", function(value, element) {
        return !$("#auto_calc_scheduled_end").prop("checked") || moment($("#scheduled_start").val(), momentJsParserFormat).isValid();
    }, "Valid Start date is required for auto-calculation to work");
}

$(function() {
    addLoginValidationMethod();
    addDurationDatePickerValidtionMethod();
    addGreaterThanOrEqualToZeroValidationMethod();
    addIsIntegerValidationMethod();
    addUniqueApproverValidationMethod();
    textMaxLength1000ValidationMethod();
    textMaxLength12000ValidationMethod();
    initValidation();
    scheduledEndOverrideValidationMethod();
    scheduledEndOverflowValidationMethod();
    warnScheduledStartRequiredValidationMethod();
});
