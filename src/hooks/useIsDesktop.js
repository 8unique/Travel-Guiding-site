import useWindowDimensions from "./useWindowDimensions";

export default function useIsDesktop() {
  const { width } = useWindowDimensions();
  return width > 768;
}
