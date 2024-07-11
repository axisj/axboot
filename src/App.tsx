import styled from "@emotion/styled";

interface StyledProps {
  hideHandle?: boolean;
  bordered?: boolean;
}

function App() {
  return (
    <>
      <Div hideHandle={true}>TEST</Div>
    </>
  );
}

const Div = styled.div<StyledProps>``;

export default App;
