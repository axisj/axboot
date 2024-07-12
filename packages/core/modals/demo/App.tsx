import { open$MODAL_FORM_WITH_LIST$Modal } from "@axboot/core/modals/MODAL_FORM_WITH_LIST/Modal$MODAL_FORM_WITH_LIST$";
import styled from "@emotion/styled";
import { Button, Space } from "antd";
import { open$EMPTY$Modal } from "@axboot/core/modals/EMPTY/Modal$EMPTY$";
import { open$FORM$Modal } from "@axboot/core/modals/FORM/Modal$FORM$";
import { open$SELECT_MULTI_ON_LIST$Modal } from "@axboot/core/modals/SELECT_MULTI_ON_LIST/Modal$SELECT_MULTI_ON_LIST$";
import { open$SELECT_ONE_ON_LIST$Modal } from "@axboot/core/modals/SELECT_ONE_ON_LIST/Modal$SELECT_ONE_ON_LIST$";

interface Props {}

function App({}: Props) {
  return (
    <Container>
      <h1>Modal Test</h1>

      <Space wrap>
        <Button
          onClick={async () => {
            await open$EMPTY$Modal({});
          }}
        >
          open$EMPTY$Modal
        </Button>
        <Button
          onClick={async () => {
            await open$FORM$Modal({});
          }}
        >
          open$FORM$Modal
        </Button>
        <Button
          onClick={async () => {
            await open$SELECT_ONE_ON_LIST$Modal({});
          }}
        >
          open$SELECT_ONE_ON_LIST$Modal
        </Button>
        <Button
          onClick={async () => {
            await open$SELECT_MULTI_ON_LIST$Modal({});
          }}
        >
          open$SELECT_MULTI_ON_LIST$Modal
        </Button>
        <Button
          onClick={async () => {
            await open$MODAL_FORM_WITH_LIST$Modal({});
          }}
        >
          open$MODAL_FORM_WITH_LIST$Modal
        </Button>
      </Space>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

export default App;
