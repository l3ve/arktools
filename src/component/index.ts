import styled from "@emotion/styled";

const Title = styled.div`
  height: 40px;
  line-height: 40px;
  text-align: center;
  box-shadow: 0 1px 4px gray;
  font-size: 16px;
  margin-bottom: 5px;
`;

const SrcollBox = styled.div`
  padding: 0 0 10px;
  overflow: hidden;
  overflow-y: scroll;
`;

const Item = styled.div`
  position: relative;
  display: flex;
  padding: 14px 16px;
  &:hover {
    .txt {
      font-weight: bolder;
    }
    .fun-box {
      transition: all 0.1s linear;
      translate: 0px;
    }
  }
`;

const Txt = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`;

const FunBox = styled.div`
  display: flex;
  justify-content:space-around;
  align-items: center;
  width: 90px;
  /* translate: 120px; */
`;

const DelBtn = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  cursor: pointer;
  &::before,
  &::after {
    position: absolute;
    content: " ";
    background-color: gray;
    left: 8px;
    width: 1px;
    height: 16px;
    transform-origin: center;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const TopBtn = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  cursor: pointer;
  &::before,
  &::after {
    position: absolute;
    content: " ";
    background-color: gray;
    left: 8px;
    top: 2px;
    width: 1px;
    height: 12px;
    transform-origin: center;
  }

  &::before {
    left:5px;
    transform: rotate(40deg);
  }

  &::after {
    left:13px;
    transform: rotate(-40deg);
  }
`;

export { Title, SrcollBox, Item, Txt, FunBox, DelBtn,TopBtn };
