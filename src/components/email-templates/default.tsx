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

interface DefaultEmailTemplateProps {
  message: string;
  redirect?: {
    page: string;
    buttonText: string;
  };
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function DefaultEmailTemplate({
  message,
  redirect,
}: DefaultEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Netlify Welcome</Preview>
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
              Spotlxgth
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
