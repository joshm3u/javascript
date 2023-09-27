// TODO: make the control allow for passing element IDs in instead of hard coding them, if found necessary

function initMultiSelectDropDowns() {
    $("#region").chosen({width: "60%", placeholder_text_multiple: "Select..."});
    $("#aws_region").chosen({width: "60%", placeholder_text_multiple: "Select..."});
    $("#data_center").chosen({width: "60%", placeholder_text_multiple: "Select..."});
    $("#az").chosen({width: "60%", placeholder_text_multiple: "Select..."});
    $("#fulfillment_center").chosen({width: "60%", placeholder_text_multiple: "Select..."});
}

/*
 * Comes from this fork: https://github.com/koenpunt/chosen
 * Details here:
 *   http://stackoverflow.com/questions/7385246/allow-new-values-with-chosen-js-multiple-select
 *   https://github.com/harvesthq/chosen/pull/166
 */
function initMultiSelectDropDownsWithCustomInput() {
    $("#region").chosen({width: "60%", placeholder_text_multiple: "Select...", create_option: true, skip_no_results: true});
    $("#aws_region").chosen({width: "60%", placeholder_text_multiple: "Select...", create_option: true, skip_no_results: true});
    $("#data_center").chosen({width: "60%", placeholder_text_multiple: "Select...", create_option: true, skip_no_results: true});
    $("#az").chosen({width: "60%", placeholder_text_multiple: "Select...", create_option: true, skip_no_results: true});
    $("#fulfillment_center").chosen({width: "60%", placeholder_text_multiple: "Select...", create_option: true, skip_no_results: true});
}

function addEmptySelectPromptToCategoryDropdown() {
    if (!$('#cti_type').val()) {
        // no category selected because type is not populated, add the '- Select -' prompt
        $('#cti_category').prepend("<option value='' selected='selected'>- Select -</option>");
    }
}

function initTimepickerAndEpochValues(onSelectHandler) {
    // configure timepicker below,
    // see https://trentrichardson.com/examples/timepicker/ for examples
    var dateTimePickerOptions = {
        dateFormat: timepickerUIControlDateFormat,
        stepMinute: 5
    };
    if (typeof(onSelectHandler) !== "undefined") {
        dateTimePickerOptions.onSelect = onSelectHandler;
    }

    //Formats can be found in datetime-common.js
    $("#scheduled_start").datetimepicker(dateTimePickerOptions);
    $("#scheduled_end").datetimepicker(dateTimePickerOptions);
    // Auto complete window blocks date picker https://issues.amazon.com/issues/TOP-12313
    $("#scheduled_start").attr("autocomplete", "off");
    $("#scheduled_end").attr("autocomplete", "off");

    $("#scheduled_start").keypress(debounce(checkChangeControlDaysByDataCallback, 1500));
    $("#scheduled_end").keypress(debounce(checkChangeControlDaysByDataCallback, 1500));

    setTimezoneElements(".timezone-text");

    if (!(isNullEmptyOrUndefined($("#scheduled_start_epoch").val()))) {
        populateTimepickerTextboxes("#scheduled_start_epoch", "#scheduled_start");
    }

    if (!(isNullEmptyOrUndefined($("#scheduled_end_epoch").val()))) {
        populateTimepickerTextboxes("#scheduled_end_epoch", "#scheduled_end");
    }
}

function initMarkdownPreviewControls() {
    $("#description-markdown-edit-btn").click(function() {
        $("#description-markdown-preview-area").hide();
        $("#description").show();

        $("#description-markdown-preview-btn").removeClass("active");
        $("#description-markdown-edit-btn").addClass("active");
    });

    $("#description-markdown-preview-btn").click(function() {

        description_markdown_preview();

        $("#description-markdown-preview-area").show();
        $("#description").hide();

        $("#description-markdown-preview-btn").addClass("active");
        $("#description-markdown-edit-btn").removeClass("active");
    });

    $("#template-description-markdown-edit-btn").click(function() {
        $("#template-description-markdown-preview-area").hide();
        $("#template_description").show();

        $("#template-description-markdown-preview-btn").removeClass("active");
        $("#template-description-markdown-edit-btn").addClass("active");
    });

    $("#template-description-markdown-preview-btn").click(function() {

        template_description_markdown_preview();

        $("#template-description-markdown-preview-area").show();
        $("#template_description").hide();

        $("#template-description-markdown-preview-btn").addClass("active");
        $("#template-description-markdown-edit-btn").removeClass("active");
    });

    $("#preflight-step-details-markdown-edit-btn").click(function() {
        $("#preflight-step-details-markdown-preview-area").hide();
        $("#preflight_step_details").show();

        $("#preflight-step-details-markdown-preview-btn").removeClass("active");
        $("#preflight-step-details-markdown-edit-btn").addClass("active");
    });

    $("#preflight-step-details-markdown-preview-btn").click(function() {

        preflight_step_description_markdown_preview();

        $("#preflight-step-details-markdown-preview-area").show();
        $("#preflight_step_details").hide();

        $("#preflight-step-details-markdown-preview-btn").addClass("active");
        $("#preflight-step-details-markdown-edit-btn").removeClass("active");
    });

    $("#preflight-step-activity-checklist-markdown-preview-btn").click(function() {
        doChecklistMarkdownPreview(
            "#preflightActivityChecklist",
            "#add_preflight_activity_checklist_item",
            "#preflight-step-activity-checklist-markdown-edit-btn",
            "#preflight-step-activity-checklist-markdown-preview-btn"
        );
    });
    $("#preflight-step-activity-checklist-markdown-edit-btn").click(function() {
        doChecklistMarkdownEdit(
            "#preflightActivityChecklist",
            "#add_preflight_activity_checklist_item",
            "#preflight-step-activity-checklist-markdown-edit-btn",
            "#preflight-step-activity-checklist-markdown-preview-btn"
        );
    });
    $("#preflight-step-rollback-checklist-markdown-preview-btn").click(function() {
        doChecklistMarkdownPreview(
            "#preflightRollbackChecklist",
            "#add_preflight_rollback_checklist_item",
            "#preflight-step-rollback-checklist-markdown-edit-btn",
            "#preflight-step-rollback-checklist-markdown-preview-btn"
        );
    });
    $("#preflight-step-rollback-checklist-markdown-edit-btn").click(function() {
        doChecklistMarkdownEdit(
            "#preflightRollbackChecklist",
            "#add_preflight_rollback_checklist_item",
            "#preflight-step-rollback-checklist-markdown-edit-btn",
            "#preflight-step-rollback-checklist-markdown-preview-btn"
        );
    });

    $("#step-details-markdown-edit-btn").click(function() {
        $("#step-details-markdown-preview-area").hide();
        $("#step_details").show();

        $("#step-details-markdown-preview-btn").removeClass("active");
        $("#step-details-markdown-edit-btn").addClass("active");
    });

    $("#step-details-markdown-preview-btn").click(function() {
        step_description_markdown_preview();

        $("#step-details-markdown-preview-area").show();
        $("#step_details").hide();

        $("#step-details-markdown-preview-btn").addClass("active");
        $("#step-details-markdown-edit-btn").removeClass("active");
    });

    $("#step-activity-checklist-markdown-preview-btn").click(function() {
        doChecklistMarkdownPreview(
            "#activityChecklist",
            "#add_activity_checklist_item",
            "#step-activity-checklist-markdown-edit-btn",
            "#step-activity-checklist-markdown-preview-btn"
        );
    });
    $("#step-activity-checklist-markdown-edit-btn").click(function() {
        doChecklistMarkdownEdit(
            "#activityChecklist",
            "#add_activity_checklist_item",
            "#step-activity-checklist-markdown-edit-btn",
            "#step-activity-checklist-markdown-preview-btn"
        );
    });
    $("#step-rollback-checklist-markdown-preview-btn").click(function() {
        doChecklistMarkdownPreview(
            "#rollbackChecklist",
            "#add_rollback_checklist_item",
            "#step-rollback-checklist-markdown-edit-btn",
            "#step-rollback-checklist-markdown-preview-btn"
        );
    });
    $("#step-rollback-checklist-markdown-edit-btn").click(function() {
        doChecklistMarkdownEdit(
            "#rollbackChecklist",
            "#add_rollback_checklist_item",
            "#step-rollback-checklist-markdown-edit-btn",
            "#step-rollback-checklist-markdown-preview-btn"
        );
    });
}

function description_markdown_preview() {
    renderMarkdown(marked($("#description").val()), $("#description-markdown-preview-area"));
}

function template_description_markdown_preview() {
    renderMarkdown(marked($("#template_description").val()), $("#template-description-markdown-preview-area"));
}

function preflight_step_description_markdown_preview() {
    renderMarkdown(marked($("#preflight_step_details").val()), $("#preflight-step-details-markdown-preview-area"));
}

function step_description_markdown_preview() {
    renderMarkdown(marked($("#step_details").val()), $("#step-details-markdown-preview-area"));
}

function checklist_markdown_preview(checklistTopLevelContainerSelector) {
    $(checklistTopLevelContainerSelector + " .checklist-item-container").each(function(index, element) {
        $(element).children(".checklist-markdown-preview-area")
            .html(marked($(element).children("textarea").first().val()))
            .append($("<hr>"))
            .show();
    });
}

function doChecklistMarkdownPreview(checklistTopLevelContainerSelector,
                                    addToChecklistButtonSelector,
                                    editMarkdownButtonSelector,
                                    previewMarkdownButtonSelector) {

    checklist_markdown_preview(checklistTopLevelContainerSelector);

    $(checklistTopLevelContainerSelector + " .checklist-item-container textarea").hide();
    $(checklistTopLevelContainerSelector + " .checklist-item-container i").hide();
    $(checklistTopLevelContainerSelector + " .checklist-item-container .delete-checklist-item").hide();

    $(addToChecklistButtonSelector).hide();

    $(editMarkdownButtonSelector).removeClass("active");
    $(previewMarkdownButtonSelector).addClass("active");
}

function doChecklistMarkdownEdit(checklistTopLevelContainerSelector,
                                 addToChecklistButtonSelector,
                                 editMarkdownButtonSelector,
                                 previewMarkdownButtonSelector) {
    $(checklistTopLevelContainerSelector + " .checklist-item-container .checklist-markdown-preview-area").hide();
    $(checklistTopLevelContainerSelector + " .checklist-item-container textarea").show();
    $(checklistTopLevelContainerSelector + " .checklist-item-container i").show();
    $(checklistTopLevelContainerSelector + " .checklist-item-container .delete-checklist-item").show();

    $(addToChecklistButtonSelector).show();

    $(editMarkdownButtonSelector).addClass("active");
    $(previewMarkdownButtonSelector).removeClass("active");
}

function initAllowLifecycleEdits() {
    $("#allow_lifecycle_edit").click(function () {
        const clickedButton = $('#allow_lifecycle_edit');
        const radioButtons = $('input[name="lifecycle"]');
        const curr_state = clickedButton.attr('state');
        if (curr_state === 'Allowed') {
            clickedButton.text('âš ï¸');
            clickedButton.attr('state', 'Locked');
            radioButtons.attr('disabled', false);
        } else {
            clickedButton.text('ðŸ”’');
            clickedButton.attr('state', 'Allowed');
            radioButtons.attr('disabled', true);
        }
    });
};
