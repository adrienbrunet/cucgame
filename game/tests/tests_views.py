from django.core.urlresolvers import reverse
from django.test import TestCase


class TestRoot(TestCase):
    def setUp(self):
        self.req = self.client.get(reverse('home'))

    def test_template(self):
        self.assertTemplateUsed('home.html')

    def test_status_code(self):
        assert self.req.status_code == 200
