package com.exam.Test.MyControllers;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.*;

public class CSVReaderDemo {
    public static void main(String[] args) throws IOException {
        File file = new File("questions.csv");
        try (
                Reader reader = new BufferedReader(new FileReader(file));
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())
        ) {
            for (CSVRecord record : csvParser) {
                System.out.println(record.get("Question"));
                System.out.println(record.get("OptionA"));
                System.out.println(record.get("OptionB"));
            }
        }
    }
}

