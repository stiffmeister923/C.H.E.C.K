import React from "react";
import { Button, Checkbox, Form, Input } from "antd";

export type Test = {
  test_number: number;
  test_type: string;
  total_points: number;
  correct_points: number | null;
  full_text: string;
  question_answer_pairs: TestItem[];
};
export type TestItem = {
  question_number: number;
  answer: string;
};
export const AnswerKeyForm = ({
  tests,
  onSubmit,
}: {
  tests: Test[];
  onSubmit: (values: { [key: string]: string }) => void;
}) => {
  const [form] = Form.useForm();

  const initialValues = tests.reduce((values, test) => {
    test.question_answer_pairs.forEach((testItem) => {
      values[`${test.test_number}-${testItem.question_number}`] =
        testItem.answer;
    });
    return values;
  }, {} as { [key: string]: string });

  return (
    <Form
      form={form}
      style={{ maxWidth: 600 }}
      onFinish={onSubmit}
      initialValues={initialValues}
    >
      {tests.map((test) => {
        return (
          <>
            <h2>{test.test_type}</h2>
            {test.question_answer_pairs.map((testItem) => {
              return (
                <Form.Item
                  name={`${test.test_number}-${testItem.question_number}`}
                  label={`Question ${testItem.question_number}`}
                  // value={testItem.answer || null}
                  required={true}
                >
                  <Input placeholder="Question 1" />
                </Form.Item>
              );
            })}
          </>
        );
      })}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
