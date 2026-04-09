import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { hasSupabaseConfig } from "../../lib/supabaseClient";
import { canAccessAdminPath } from "../../utils/adminPermissions";

export default function RequireAdmin() {
  const location = useLocation();
  const { loading, session, profile, signOut } = useAdminAuth();

  if (!hasSupabaseConfig()) {
    return (
      <Container sx={{ py: 8 }}>
        <Card sx={{ maxWidth: 640, mx: "auto", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2}>
              <LockRoundedIcon color="primary" />
              <Typography variant="h4">Supabase is not configured</Typography>
              <Typography color="text.secondary">
                Add your local Supabase URL and publishable key in `.env`, then restart the dev
                server to use admin login.
              </Typography>
              <Button component={RouterLink} to="/" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Back to Site
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Checking admin session...</Typography>
      </Container>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!profile || !canAccessAdminPath(profile.role, location.pathname)) {
    return (
      <Container sx={{ py: 8 }}>
        <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2}>
              <LockRoundedIcon color="error" />
              <Typography variant="h4">Admin access not approved</Typography>
              <Typography color="text.secondary">
                This account is signed in, but it does not have permission to open this admin
                area.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button component={RouterLink} to="/admin/login" variant="contained">
                  Back to Login
                </Button>
                <Button variant="outlined" onClick={() => void signOut()}>
                  Sign Out
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return <Outlet />;
}
