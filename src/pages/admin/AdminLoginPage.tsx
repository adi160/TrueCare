import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Box, Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { hasSupabaseConfig } from "../../lib/supabaseClient";
import { canAccessAdminPath, getAdminLandingRoute } from "../../utils/adminPermissions";

type LoginState = {
  from?: string;
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, signIn, loading, configReady } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const from = (location.state as LoginState | null)?.from ?? "/admin";

  useEffect(() => {
    if (session && profile) {
      const nextRoute = canAccessAdminPath(profile.role, from) ? from : getAdminLandingRoute(profile.role);
      navigate(nextRoute, { replace: true });
    }
  }, [from, navigate, profile, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await signIn(email, password);
    setSubmitting(false);

    if (!result.success) {
      setMessage(result.message);
    }
  }

  if (!hasSupabaseConfig() || !configReady) {
    return (
      <Container sx={{ py: 8 }}>
        <Card sx={{ maxWidth: 640, mx: "auto", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Admin login is not configured
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add your Supabase URL and publishable key to `.env`, then restart the dev server.
            </Typography>
            <Button component={RouterLink} to="/" variant="contained">
              Back to Site
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Card sx={{ maxWidth: 560, mx: "auto", borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(31,157,148,0.12)", display: "grid", placeItems: "center", mb: 2 }}>
            <LockOutlinedIcon color="primary" />
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Admin Sign In
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Use your approved Supabase admin account to access the dashboard and content editor.
          </Typography>

          {message ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          ) : null}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
              required
            />
            <Button type="submit" variant="contained" disabled={submitting || loading}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
