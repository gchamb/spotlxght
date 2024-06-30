import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { env } from "~/env";

interface DefaultEmailTemplateProps {
  message: string;
  redirect?: {
    page: string;
    buttonText: string;
  };
}

const baseUrl =
  env.NODE_ENV === "development"
    ? `https://dev.spotlxght.com`
    : "http://spotlxght.com";

export default function DefaultEmailTemplate({
  message,
  redirect,
}: DefaultEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#1e1e1e",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite font-sans text-base">
          <Container className="p-45 bg-white">
            <Heading className="my-0 text-center font-bold leading-8">
              Spotlxght
            </Heading>

            <Section>
              <Row>
                <Text className="text-center text-base">{message}</Text>
              </Row>
            </Section>

            {redirect && (
              <Section className="text-center">
                <Button
                  href={`${baseUrl}/${redirect.page}`}
                  className="bg-brand rounded-lg px-[18px] py-3 text-white"
                >
                  {redirect.buttonText}
                </Button>
              </Section>
            )}

            <Section className="text-center">
              <Row>
                <Text className="text-center text-base">Thank you,</Text>
                <Text className="text-center text-base">Spotlxght</Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
