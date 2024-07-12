import styled from "@emotion/styled";
import { Button, Input, Space } from "antd";
import { useErrorBoundary } from "react-error-boundary";

export function ErrorFallback({ error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <Container>
      <h3>Something went wrong:</h3>
      <Input.TextArea style={{ color: "red", marginBottom: 10 }} value={error.stack ?? error.message} rows={20} />

      <Space>
        <Button onClick={resetBoundary}>Try again</Button>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </Space>
    </Container>
  );
}

const Container = styled.div`
  padding: 1rem;
`;
