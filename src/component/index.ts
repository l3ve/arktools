import styled from "@emotion/styled";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
`;

const Title = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  box-shadow: 0 1px 4px gray;
  font-size: 16px;
  background-color: white;
  user-select: none;
`;

const SrcollBox = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`;

const SrcollPlaceholder = styled.div`
  width: 100vw;
  padding-bottom: 10px;
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

const Line = styled.div`
  margin: 10px 45px;
  border: 1px solid rgba(33, 33, 33, 0.3);
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
  justify-content: space-around;
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
    left: 5px;
    transform: rotate(40deg);
  }

  &::after {
    left: 13px;
    transform: rotate(-40deg);
  }
`;

const SaveBtn = styled.div`
  position: relative;
  cursor: pointer;
  color: gray;
  &.save::after {
    content: "★";
    color: blue;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export {
  Container,
  Title,
  SrcollBox,
  SrcollPlaceholder,
  Item,
  Txt,
  FunBox,
  DelBtn,
  TopBtn,
  SaveBtn,
  Line,
};
