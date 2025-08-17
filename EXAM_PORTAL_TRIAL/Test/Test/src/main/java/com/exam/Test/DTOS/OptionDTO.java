package com.exam.Test.DTOS;

public class OptionDTO {
    public OptionDTO() {
    }

    private Long id;

    public OptionDTO(Long id, String optionText) {
        this.id = id;
        this.optionText = optionText;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String optionText;
}
